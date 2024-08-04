import {
  Component,
  DestroyRef,
  Inject,
  WritableSignal,
  inject,
  signal,
} from '@angular/core'

import {
  TuiAlertService,
  TuiDialogContext,
  TuiHintModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TuiFileLike, TuiInputFilesModule } from '@taiga-ui/kit'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { catchError, of, switchMap, takeLast } from 'rxjs'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { AccountService } from '@services'

import { UploadModel } from '@models'

@Component({
  selector: 'spomen-change-avatar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputFilesModule,
    TuiLoaderModule,
    TuiSvgModule,
    TuiHintModule,
  ],
  templateUrl: './change-avatar.component.html',
  styleUrl: './change-avatar.component.scss',
})
@Sentry.TraceClass({ name: 'ChangeAvatar' })
export class ChangeAvatarComponent {
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private account = inject(AccountService)

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      any,
      {
        accountId: string
        avatarAlreadyExists: boolean
      }
    >
  ) {
    this.targetAccountId = context.data.accountId
    this.avatarAlreadyExists = context.data.avatarAlreadyExists
  }

  readonly control = new FormControl<TuiFileLike | null>(null)

  isLoading: WritableSignal<boolean> = signal(false)

  private targetAccountId: string
  avatarAlreadyExists: boolean

  removeFile(): void {
    this.control.setValue(null)
  }

  changeAvatar() {
    this.isLoading.set(true)

    if (this.avatarAlreadyExists) {
      this.account
        .removeAvatar({
          id: this.targetAccountId,
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((res) => {
            return of(new Error(res.error))
          }),
          switchMap((res) =>
            res instanceof Error ? of(res) : this.uploadAvatar()
          )
        )
        .subscribe({
          next: (res) => this.handleUploadResult(res),
          error: (err) => {
            this.showError('Возникла проблема. Попробуйте позже')
            throw err
          },
        })
    } else {
      this.uploadAvatar().subscribe({
        next: (res) => this.handleUploadResult(res as UploadModel),
        error: (err) => {
          this.showError('Возникла проблема. Попробуйте позже')
          throw err
        },
      })
    }
  }

  removeAvatar() {
    this.isLoading.set(true)

    this.account
      .removeAvatar({
        id: this.targetAccountId,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.isLoading.set(false)
          this.context.completeWith(true)
        },
        error: (err) => {
          this.showError('Возникла проблема. Попробуйте позже')
        },
      })
  }

  private uploadAvatar() {
    return this.account
      .uploadAvatar({
        file: this.control.value!,
        id: this.targetAccountId,
      })
      .pipe(takeUntilDestroyed(this.destroyRef), takeLast(1))
  }

  private handleUploadResult(res: UploadModel | Error) {
    if (res instanceof Error) {
      this.showError('Возникла проблема. Попробуйте позже')
      throw res
    }

    this.isLoading.set(false)

    this.context.completeWith(res ? res.url : null)
  }

  private showError(err: string) {
    this.isLoading.set(false)

    this.alerts.open(err, { status: 'error' }).subscribe()
  }
}
