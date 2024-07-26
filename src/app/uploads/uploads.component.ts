import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
  TuiHintModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core'

import {
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core'

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'

import {
  TUI_PROMPT,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiSelectModule,
} from '@taiga-ui/kit'

import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { TuiTablePaginationModule } from '@taiga-ui/addon-table'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import * as Sentry from '@sentry/angular'

import { UploadsQueryRef, UploadsGQL, DeleteUploadByIdGQL } from '@graphql'
import { AuthService, ScrollService } from '@services'
import { inOutGridAnimation200 } from '@animations'
import { serializePermissions } from '@utils'
import { UploadModel } from '@models'
import { Permission } from '@enums'

import { PermissionInputComponent } from '@components/permission-input'
import { ExtensionInputComponent } from '@components/extension-input'
import { AccountInputComponent } from '@components/account-input'
import { NotFoundComponent } from '@components/not-found'

import { UploadListItemComponent } from './upload-list-item/upload-list-item.component'
import { UploadPreviewComponent } from './upload-preview/upload-preview.component'
import { UploadFileComponent } from './upload-file/upload-file.component'
import { UploadInfoComponent } from './upload-info/upload-info.component'

@Component({
  selector: 'spomen-uploads',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiSvgModule,
    TuiTablePaginationModule,
    TuiDialogModule,
    TuiHintModule,
    UploadListItemComponent,
    ExtensionInputComponent,
    AccountInputComponent,
    PermissionInputComponent,
    NotFoundComponent,
    UploadPreviewComponent,
  ],
  providers: [UploadsGQL, DeleteUploadByIdGQL],
  animations: [inOutGridAnimation200],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss',
})
@Sentry.TraceClass({ name: 'Uploads' })
export class UploadsComponent implements OnInit {
  private currentUser = inject(AuthService).$user().username
  private dialogs = inject(TuiDialogService)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private scroll = inject(ScrollService)
  private injector = inject(Injector)

  private deleteUploadByIdGQL = inject(DeleteUploadByIdGQL)
  private uploadsGQL = inject(UploadsGQL)

  isAdministrator = inject(AuthService).$isAdmin()

  private uploadsQuery: UploadsQueryRef | null = null
  private isLastPage = false

  skeletonRows = new Array(10)
  modalFiltersIsOpen = false

  $previewStatus: WritableSignal<boolean> = signal(false)
  $previewUpload: WritableSignal<UploadModel | null> = signal(null)

  $page: WritableSignal<number> = signal(1)
  $size: WritableSignal<number> = signal(20)

  $uploads: WritableSignal<UploadModel[]> = signal([])
  $uploadsLoading: WritableSignal<boolean> = signal(true)

  uploadFiltersForm = new FormGroup({
    name: new FormControl(),
    ext: new FormControl(),
    account: new FormControl(),
    permissions: new FormControl(),
  })

  private $permissions: WritableSignal<Permission[]> = signal([])
  private $name: WritableSignal<string> = signal('')
  private $ext: WritableSignal<string[]> = signal([])
  private $owner: WritableSignal<string[]> = signal([])

  ngOnInit() {
    this.scroll.isEnd
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.scroll.next(false, 0)

        if (this.$uploadsLoading() || this.isLastPage) return

        this.fetchMoreUploads()
      })

    if (this.currentUser) {
      this.uploadFiltersForm.controls['account'].setValue([this.currentUser])

      this.$owner.set([this.currentUser])
    }

    this.uploadsQuery = this.uploadsGQL.watch(this.params)

    this.uploadsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.data.uploads.length === 0) this.isLastPage = true

          this.$uploads.update((prev) => prev.concat(res.data.uploads))

          this.$uploadsLoading.set(false)
        },
        error: () => {
          this.alerts
            .open('Не удалось получить список загрузок', { status: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
          this.$uploadsLoading.set(false)
        },
      })

    this.uploadFiltersForm.controls['account'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$owner.set(items)
        this.resetUploads()
      })

    this.uploadFiltersForm.controls['ext'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$ext.set(items)
        this.resetUploads()
      })

    this.uploadFiltersForm.controls['name'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$name.set(items)
        this.resetUploads()
      })

    this.uploadFiltersForm.controls['permissions'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((permissions) => {
        this.$permissions.set(serializePermissions(permissions))
        this.resetUploads()
      })
  }

  showUploadFile() {
    this.showUploadFileDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  showUploadInfo(uploadId: string) {
    if (this.$previewStatus()) {
      this.$previewStatus.set(false)
      this.$previewUpload.set(null)
    }

    this.showUploadInfoDialog(uploadId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  showUploadPreview(upload: UploadModel) {
    this.$previewUpload.set(upload)
    this.$previewStatus.set(true)
  }

  showModalFilters() {
    this.modalFiltersIsOpen = true
  }

  handleClosePreview() {
    this.$previewStatus.set(false)
    this.$previewUpload.set(null)
  }

  handleDeletedUpload(id: string) {
    this.alerts
      .open('Файл успешно удалён', {
        status: 'success',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()

    this.$uploads.update((items) => items.filter((item) => item.id !== id))
  }

  handleDeletePreviewedUpload() {
    this.showPrompt('Удалить файл?').subscribe((res) => {
      if (res) {
        this.showPrompt('Вы уверены?').subscribe((res) => {
          if (res) this.deletePreviewedUpload()
        })
      }
    })
  }

  isPrivate(permissions: Permission[]) {
    return !permissions.includes(Permission.Public)
  }

  setExtensionFilter(ext: string) {
    const currentValue = this.uploadFiltersForm.controls['ext'].value

    if (!currentValue) this.uploadFiltersForm.controls['ext'].setValue([ext])

    if (Array.isArray(currentValue) && !currentValue.includes(ext.trim())) {
      this.uploadFiltersForm.controls['ext'].setValue([
        ...this.uploadFiltersForm.controls['ext'].value,
        ext,
      ])
    }
  }

  private deletePreviewedUpload() {
    this.deleteUploadByIdGQL
      .mutate({
        id: this.$previewUpload()!.id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.handleDeletedUpload(this.$previewUpload()!.id)

          this.handleClosePreview()
        },
        error: (err) => {
          console.log(err)

          this.handleClosePreview()

          this.alerts
            .open('Удалить файл не удалось', {
              status: 'error',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
        },
      })
  }

  private get params() {
    const owner = !this.isAdministrator
      ? [this.currentUser!]
      : this.$owner().length === 0
        ? undefined
        : this.$owner()

    return {
      size: this.$size(),
      page: this.$page(),
      owner,
      name: this.$name().trim().length === 0 ? undefined : this.$name(),
      ext: this.$ext().length === 0 ? undefined : this.$ext(),
      permissions:
        this.$permissions().length === 0 ? undefined : this.$permissions(),
    }
  }

  private refetchUploads() {
    this.$uploadsLoading.set(true)

    this.uploadsQuery!.refetch(this.params)
  }

  private resetUploads() {
    this.$page.set(1)
    this.$uploads.set([])
    this.isLastPage = false

    this.refetchUploads()
  }

  private fetchMoreUploads() {
    this.$page.set(this.$page() + 1)

    this.refetchUploads()
  }

  private showUploadFileDialog = () =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(UploadFileComponent, this.injector),
      {
        size: 's',
      }
    )

  private showUploadInfoDialog = (uploadId: string) =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(UploadInfoComponent, this.injector),
      {
        size: 's',
        data: {
          uploadId,
        },
      }
    )

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
