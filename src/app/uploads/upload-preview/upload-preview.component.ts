import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import {
  TuiPreviewDialogService,
  TuiPreviewModule,
} from '@taiga-ui/addon-preview'
import {
  PolymorpheusContent,
  PolymorpheusModule,
} from '@tinkoff/ng-polymorpheus'
import { TuiPdfViewerOptions, TuiPdfViewerService } from '@taiga-ui/kit'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TuiDialogContext, TuiSvgModule } from '@taiga-ui/core'
import { DomSanitizer } from '@angular/platform-browser'
import { TUI_IS_MOBILE } from '@taiga-ui/cdk'
import * as Sentry from '@sentry/angular'
import { Subscription } from 'rxjs'

import { AuthService } from '@services'
import { IFrameUrlPipe } from '@pipes'
import { UploadModel } from '@models'

import { UploadActionsComponent } from '../upload-actions/upload-actions.component'

@Component({
  selector: 'spomen-upload-preview',
  standalone: true,
  imports: [
    IFrameUrlPipe,
    PolymorpheusModule,
    TuiPreviewModule,
    UploadActionsComponent,
    TuiSvgModule,
  ],
  templateUrl: './upload-preview.component.html',
  styleUrl: './upload-preview.component.scss',
})
@Sentry.TraceClass({ name: 'UploadPreview' })
export class UploadPreviewComponent {
  previews = inject(TuiPreviewDialogService)
  pdfViewers = inject(TuiPdfViewerService)
  sanitizer = inject(DomSanitizer)

  destroyRef = inject(DestroyRef)
  isMobile = inject(TUI_IS_MOBILE)

  userId = inject(AuthService).$user().id
  isAdmin = inject(AuthService).$isAdmin()

  upload = input.required<UploadModel | null>()
  isLoading = input<boolean>(false)
  isOpen = input.required<boolean>()

  handleDelete = output()
  handleOpen = output()
  handleClose = output()

  isRotatable = computed(() =>
    this.upload() ? this.upload()!.ext === 'webp' : false
  )
  isZoomable = computed(() =>
    this.upload() ? this.upload()!.ext === 'webp' : false
  )

  id = computed(() => (this.upload() ? this.upload()!.id : ''))
  title = computed(() =>
    this.upload() ? `${this.upload()!.file_name}.${this.upload()!.ext}` : ''
  )
  ext = computed(() => (this.upload() ? this.upload()!.ext : ''))
  name = computed(() => (this.upload() ? this.upload()!.name : ''))
  url = computed(() => (this.upload() ? this.upload()!.url : ''))

  uploadActions = computed(() => ({
    open: true,
    save: false,
    delete: this.isAdmin || this.userId === this.upload()!.owner_id,
  }))

  private previewSub: Subscription | null = null
  index = 0

  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext>

  @ViewChild('actions')
  readonly actions?: TemplateRef<TuiDialogContext>

  get previewContent(): PolymorpheusContent {
    return this.url()
  }

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.show(this.actions)
      } else if (this.previewSub) this.previewSub.unsubscribe()
    })
  }

  show(actions: PolymorpheusContent<TuiPdfViewerOptions>) {
    if (this.ext() === 'pdf') {
      this.previewSub = this.pdfViewers
        .open(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            this.isMobile
              ? `https://drive.google.com/viewerng/viewer?embedded=true&url=${this.url()}`
              : this.url()
          ),
          {
            label: this.name(),
            actions,
          }
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          complete: () => {
            this.handleClose.emit()
          },
        })
      return
    }

    this.previewSub = this.previews
      .open(this.preview || '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.handleClose.emit()
        },
      })
  }
}
