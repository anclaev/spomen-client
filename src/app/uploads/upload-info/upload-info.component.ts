import {
  Component,
  DestroyRef,
  Inject,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core'

import { TuiAlertService, TuiDialogContext } from '@taiga-ui/core'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import * as Sentry from '@sentry/angular'

import { UploadByIdGQL } from '@graphql'
import { UploadModel } from '@models'

@Component({
  selector: 'spomen-upload-info',
  standalone: true,
  imports: [],
  providers: [UploadByIdGQL],
  templateUrl: './upload-info.component.html',
  styleUrl: './upload-info.component.scss',
})
@Sentry.TraceClass({ name: 'UploadInfo' })
export class UploadInfoComponent implements OnInit {
  private uploadByIdGQL = inject(UploadByIdGQL)
  private destroyRef = inject(DestroyRef)
  private alerts = inject(TuiAlertService)

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      any,
      {
        uploadId: string
      }
    >
  ) {
    this.uploadId = context.data.uploadId
  }

  private uploadId: string

  $upload: WritableSignal<UploadModel | null> = signal(null)
  $loading: WritableSignal<boolean> = signal(true)

  ngOnInit(): void {
    this.uploadByIdGQL
      .watch({
        id: this.uploadId,
      })
      .valueChanges.subscribe({
        next: (res) => {
          this.$upload.set(res.data.upload)
          this.$loading.set(false)
        },
        error: () => {
          this.alerts
            .open('Не удалось получить информацию о загрузке', {
              status: 'error',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
          this.$loading.set(false)
        },
      })
  }
}
