import {
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputInlineModule,
  TuiLineClampModule,
  TuiStepperModule,
  TuiToggleModule,
} from '@taiga-ui/kit'

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core'
import {
  TuiAlertService,
  TuiLoaderModule,
  TuiSvgModule,
  TuiLinkModule,
} from '@taiga-ui/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TuiChipModule } from '@taiga-ui/experimental'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { AuthService, UploadService } from '@services'
import { AuthenticatedUser } from '@interfaces'
import { UploadModel } from '@models'

@Component({
  selector: 'spomen-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputFilesModule,
    TuiLoaderModule,
    TuiStepperModule,
    TuiInputInlineModule,
    TuiToggleModule,
    TuiChipModule,
    TuiSvgModule,
    TuiLineClampModule,
    TuiLinkModule,
  ],
  providers: [UploadService],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
@Sentry.TraceClass({ name: 'UploadFile' })
export class UploadFileComponent implements OnInit {
  private user: AuthenticatedUser = inject(AuthService).$user()
  private upload: UploadService = inject(UploadService)
  private destroyRef = inject(DestroyRef)
  private alerts = inject(TuiAlertService)

  isLoading: WritableSignal<boolean> = signal(false)
  uploaded: WritableSignal<UploadModel | null> = signal(null)

  readonly control = new FormControl<TuiFileLike | null>(null)

  readonly fileForm = new FormGroup({
    name: new FormControl('file', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    ext: new FormControl('.png'),
    compress: new FormControl(true),
    private: new FormControl(false),
  })

  currentStep: number = 1

  ngOnInit() {
    this.fileForm.controls['ext'].disable()
  }

  removeFile(): void {
    this.control.setValue(null)
  }

  nextStep() {
    if (!this.control.value) {
      return
    }

    const selectedFile = this.upload.getFileParams(this.control.value)

    this.fileForm.controls['name'].setValue(selectedFile.name)
    this.fileForm.controls['ext'].setValue('.' + selectedFile.ext)

    this.currentStep++
  }

  uploadFile() {
    if (
      !this.fileForm.controls['name'].valid ||
      this.fileForm.controls['name'].value!.trim().length === 0
    ) {
      this.alerts
        .open('Название файла не может быть меньше 2 символов')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe()

      return
    }

    const isCustomName =
      this.control.value!.name !==
      this.fileForm.controls['name'].value! +
        '' +
        this.fileForm.controls['ext'].value!

    this.isLoading.set(true)

    this.upload
      .uploadFile({
        file: this.control.value!,
        compress: this.fileForm.controls['compress'].value!,
        private: this.fileForm.controls['private'].value!,
        path: this.user.id!,
        name: isCustomName ? this.fileForm.controls['name'].value! : undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false)

          this.uploaded.set(res)

          this.alerts
            .open('Файл успешно загружен', {
              status: 'success',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()

          this.currentStep++
        },
        error: () => {
          this.isLoading.set(false)

          this.alerts
            .open('Ошибка загрузки файла', {
              status: 'error',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()

          // TODO: Обработка превышенного лимита файлов
        },
      })
  }
}
