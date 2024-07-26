import {
  Component,
  DestroyRef,
  Inject,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core'

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { TuiInputInlineModule, TuiLineClampModule } from '@taiga-ui/kit'
import { TuiAlertService, TuiDialogContext } from '@taiga-ui/core'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TuiChipModule } from '@taiga-ui/experimental'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { UploadByIdGQL } from '@graphql'
import { UploadModel } from '@models'

@Component({
  selector: 'spomen-upload-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputInlineModule,
    TuiChipModule,
    TuiLineClampModule,
  ],
  providers: [UploadByIdGQL],
  templateUrl: './upload-info.component.html',
  styleUrl: './upload-info.component.scss',
})
@Sentry.TraceClass({ name: 'UploadInfo' })
export class UploadInfoComponent implements OnInit {
  private uploadByIdGQL = inject(UploadByIdGQL)
  private destroyRef = inject(DestroyRef)
  private alerts = inject(TuiAlertService)

  uploadInfoForm: FormGroup = new FormGroup({
    name: new FormControl(),
    originalName: new FormControl(),
  })

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
          const { upload } = res.data

          this.$upload.set(upload)

          this.uploadInfoForm.controls['name'].setValue(upload.name)
          this.uploadInfoForm.controls['originalName'].setValue(
            upload.file_name
          )

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
