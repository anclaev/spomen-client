import {
  Component,
  DestroyRef,
  OnInit,
  WritableSignal,
  inject,
  signal,
  computed,
  input,
  output,
} from '@angular/core'

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ControlEvent,
} from '@angular/forms'

import {
  TUI_PROMPT,
  TuiAvatarModule,
  TuiInputInlineModule,
  TuiLineClampModule,
  TuiToggleModule,
} from '@taiga-ui/kit'

import { TuiAlertService, TuiDialogService } from '@taiga-ui/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TuiChipModule } from '@taiga-ui/experimental'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'
import { Router } from '@angular/router'
import { filter, map, take } from 'rxjs'

import { DeleteUploadByIdGQL, UploadByIdGQL } from '@graphql'
import { UploadActionsParams } from '@interfaces'
import { AuthService } from '@services'
import { UploadModel } from '@models'
import { Permission } from '@enums'

import { UploadActionsComponent } from '../upload-actions/upload-actions.component'

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
    UploadActionsComponent,
  ],
  providers: [UploadByIdGQL, DeleteUploadByIdGQL],
  templateUrl: './upload-info.component.html',
  styleUrl: './upload-info.component.scss',
})
@Sentry.TraceClass({ name: 'UploadInfo' })
export class UploadInfoComponent implements OnInit {
  private uploadByIdGQL = inject(UploadByIdGQL)
  private dialogs = inject(TuiDialogService)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)

  private deleteUploadByIdGQL = inject(DeleteUploadByIdGQL)

  userId = inject(AuthService).$user().id!
  isAdmin = inject(AuthService).$isAdmin()

  uploadInfoForm: FormGroup = new FormGroup({
    name: new FormControl(),
    originalName: new FormControl(),
    isPrivate: new FormControl(false),
    isSystem: new FormControl(false),
    owner: new FormControl(null),
    ownerAvatar: new FormControl(null),
  })

  uploadId = input.required<string>()
  onDelete = output<string>()

  $upload: WritableSignal<UploadModel | null> = signal(null)
  $loading: WritableSignal<boolean> = signal(true)
  $edited: WritableSignal<boolean> = signal(false)

  $editable = computed<boolean>(() => {
    const upload = this.$upload()

    return this.$upload()
      ? this.isAdmin ||
          (upload!.owner ? upload!.owner!.id === this.userId : false)
      : false
  })

  $actions = computed<UploadActionsParams>(() => ({
    open: false,
    save: this.$editable() && this.$edited(),
    delete: this.$editable(),
  }))

  ngOnInit(): void {
    this.uploadInfoForm.controls['isSystem'].disable()

    this.uploadInfoForm.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((e: ControlEvent<unknown>) => e.source.dirty),
        map((e) => {
          this.$edited.set(true)
        })
      )
      .subscribe()

    this.uploadByIdGQL
      .watch({
        id: this.uploadId()!,
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

  clickOwner() {
    if (this.uploadInfoForm.controls['owner'].value) {
      this.router.navigate(['/' + this.$upload()!.owner!.username])
    }
  }

  handleSaveUpload() {
    const editedControls = Object.keys(this.uploadInfoForm.controls)
      .map((control) => {
        return this.uploadInfoForm.controls[control].dirty
          ? { [control]: this.uploadInfoForm.controls[control].value }
          : null
      })
      .filter((val) => val)

    console.log(editedControls)
  }

  handleDeleteUpload() {
    this.showPrompt('Удалить файл?').subscribe((res) => {
      if (res) {
        this.showPrompt('Вы уверены?').subscribe((res) => {
          if (res) this.deleteUpload()
        })
      }
    })
  }

  private deleteUpload() {
    if (!this.$upload() || !this.$editable()) return

    this.deleteUploadByIdGQL
      .mutate({
        id: this.$upload()!.id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.onDelete.emit(this.$upload()!.id)
        },
        error: (err) => {
          console.log(err)

          this.alerts
            .open('Удалить файл не удалось', {
              status: 'error',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
        },
      })
  }

  private showPrompt(label: string) {
    return this.dialogs
      .open<boolean>(TUI_PROMPT, {
        label,
        size: 's',
        data: {
          yes: 'Да',
          no: 'Нет',
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
  }
}
