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

import {
  TuiAvatarModule,
  TuiInputInlineModule,
  TuiLineClampModule,
  TuiToggleModule,
} from '@taiga-ui/kit'
import { TuiAlertService, TuiDialogContext } from '@taiga-ui/core'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TuiChipModule } from '@taiga-ui/experimental'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { Router } from '@angular/router'
import { UploadByIdGQL } from '@graphql'
import { UploadModel } from '@models'
import { Permission } from '@enums'

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
    TuiToggleModule,
    TuiAvatarModule,
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
  private router = inject(Router)

  uploadInfoForm: FormGroup = new FormGroup({
    name: new FormControl(),
    originalName: new FormControl(),
    isPrivate: new FormControl(false),
    isSystem: new FormControl(false),
    owner: new FormControl(null),
    ownerAvatar: new FormControl(null),
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
    this.uploadInfoForm.controls['isSystem'].disable()

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
          this.uploadInfoForm.controls['isSystem'].setValue(upload.is_system)
          this.uploadInfoForm.controls['isPrivate'].setValue(
            upload.permissions.includes(Permission.OwnerOnly)
          )

          this.uploadInfoForm.controls['owner'].setValue(
            upload.owner
              ? upload.owner.first_name && upload.owner.last_name
                ? upload.owner.first_name + ' ' + upload.owner.last_name
                : upload.owner.username
              : null
          )

          this.uploadInfoForm.controls['ownerAvatar'].setValue(
            upload.owner
              ? upload.owner.avatar && upload.owner.avatar.url
                ? upload!.owner!.avatar!.url
                : upload!.owner!.vk_avatar
              : null
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
  // TODO: Кнопки предпросмотра, скачивания, удаления и обновления
  // TODO: Скрытие прав доступа и флага системного, если файл не принадлежит пользователю
  clickOwner() {
    if (this.uploadInfoForm.controls['owner'].value) {
      this.router.navigate(['/' + this.$upload()!.owner!.username])
    }
  }
}
