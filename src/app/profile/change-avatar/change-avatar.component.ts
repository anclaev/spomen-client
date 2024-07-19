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
import { catchError, of, switchMap, takeLast } from 'rxjs'
import { TuiFileLike, TuiInputFilesModule } from '@taiga-ui/kit'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { AuthService, AccountService } from '@services'

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
  private auth = inject(AuthService)

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
            this.showError(res.error.message)
            return of(new Error(res.error))
          }),
          switchMap((res) => (res ? this.uploadAvatar() : of(null)))
        )
        .subscribe({
          next: (res) => this.handleUploadResult(res as UploadModel),
          error: () => {
            this.isLoading.set(false)
          },
        })
    } else {
      this.uploadAvatar().subscribe({
        next: (res) => this.handleUploadResult(res as UploadModel),
        error: () => {
          this.isLoading.set(false)
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.showError(err)
          return of(new Error(err))
        })
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false)
          this.context.completeWith(true)
        },
        error: () => {
          this.isLoading.set(false)
        },
      })
  }

  private uploadAvatar() {
    return this.account
      .uploadAvatar({
        file: this.control.value!,
        id: this.targetAccountId,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        takeLast(1),
        catchError((res) => {
          this.showError(res.error.message)
          return of(new Error(res.error))
        })
      )
  }

  private handleUploadResult(res: UploadModel | null) {
    this.isLoading.set(false)

    this.context.completeWith(res ? res.url : null)
  }

  private showError(err: string) {
    this.alerts
      .open(err, { status: 'error' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }
}
