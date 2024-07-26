import {
  TUI_PROMPT,
  TuiAvatarModule,
  TuiLineClampModule,
  TuiPdfViewerOptions,
  TuiPdfViewerService,
  TuiPromptModule,
} from '@taiga-ui/kit'

import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'

import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiHintModule,
  TuiSvgModule,
} from '@taiga-ui/core'

import {
  TuiButtonModule,
  TuiChipModule,
  TuiSkeletonModule,
} from '@taiga-ui/experimental'

import {
  TuiPreviewDialogService,
  TuiPreviewModule,
} from '@taiga-ui/addon-preview'

import {
  PolymorpheusContent,
  PolymorpheusModule,
} from '@tinkoff/ng-polymorpheus'

import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule, DatePipe } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'
import { Router, RouterModule } from '@angular/router'
import { TUI_IS_MOBILE } from '@taiga-ui/cdk'
import * as Sentry from '@sentry/angular'

import { DeleteUploadByIdGQL } from '@graphql'
import { IFrameUrlPipe } from '@pipes'
import { UploadModel } from '@models'
import { Subscription } from 'rxjs'

@Component({
  selector: 'spomen-upload-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSkeletonModule,
    TuiLineClampModule,
    TuiPreviewModule,
    TuiButtonModule,
    TuiChipModule,
    TuiHintModule,
    TuiAvatarModule,
    TuiSvgModule,
    PolymorpheusModule,
    TuiPromptModule,
    IFrameUrlPipe,
  ],
  providers: [DatePipe, DeleteUploadByIdGQL],
  templateUrl: './upload-list-item.component.html',
  styleUrl: './upload-list-item.component.scss',
})
@Sentry.TraceClass({ name: 'UploadListItem' })
export class UploadListItemComponent {
  deleteUploadByIdGQL = inject(DeleteUploadByIdGQL)
  previewDialog = inject(TuiPreviewDialogService)
  pdfViewer = inject(TuiPdfViewerService)
  dialog = inject(TuiDialogService)
  alerts = inject(TuiAlertService)
  sanitizer = inject(DomSanitizer)
  destroyRef = inject(DestroyRef)
  isMobile = inject(TUI_IS_MOBILE)
  router = inject(Router)

  @Input('upload') upload: UploadModel | null = null
  @Input('isLoading') isLoading: boolean = false
  @Input('isPrivate') isPrivate: boolean = false

  @Output('onDelete') onDelete: EventEmitter<any> = new EventEmitter()
  @Output('clickUpload') clickUpload: EventEmitter<any> = new EventEmitter()
  @Output('selectExtension') selectExtension: EventEmitter<any> =
    new EventEmitter()

  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext>

  index = 0

  get previewContent(): PolymorpheusContent {
    return this.upload!.url
  }

  handleClickUpload() {
    this.clickUpload.emit()
  }

  handleSelectExtension() {
    this.selectExtension.emit()
  }

  private dialogSub: Subscription | null = null

  showPreview(actions: PolymorpheusContent<TuiPdfViewerOptions>) {
    if (this.upload!.ext === 'pdf') {
      this.dialogSub = this.pdfViewer
        .open(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            this.isMobile
              ? `https://drive.google.com/viewerng/viewer?embedded=true&url=${this.upload!.url}`
              : this.upload!.url
          ),
          {
            label: this.upload!.name,
            actions,
          }
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe()

      return
    }

    this.dialogSub = this.previewDialog
      .open(this.preview || '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  delete() {
    this.showPrompt('Удалить файл?').subscribe((res) => {
      if (res) {
        this.showPrompt('Вы уверены?').subscribe((res) => {
          if (res) this.handleDelete()
        })
      }
    })
  }

  private showPrompt(label: string) {
    return this.dialog
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

  private handleDelete() {
    this.deleteUploadByIdGQL
      .mutate({
        id: this.upload!.id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.dialogSub) this.dialogSub.unsubscribe()

          this.alerts
            .open('Файл успешно удалён', {
              status: 'success',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()

          this.onDelete.emit()
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
}
