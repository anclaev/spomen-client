import { TuiPreviewActionModule } from '@taiga-ui/addon-preview'
import { TuiHintModule, TuiSvgModule } from '@taiga-ui/core'
import { Component, input, output } from '@angular/core'
import * as Sentry from '@sentry/angular'

import { UploadActionsParams } from '@interfaces'

@Component({
  selector: 'spomen-upload-actions',
  standalone: true,
  imports: [TuiSvgModule, TuiPreviewActionModule, TuiHintModule],
  templateUrl: './upload-actions.component.html',
  styleUrl: './upload-actions.component.scss',
})
@Sentry.TraceClass({ name: 'UploadActions' })
export class UploadActionsComponent {
  _actions = input.required<UploadActionsParams>({ alias: 'actions' })
  url = input.required<string>()

  preview = input<{ complete: () => void } | null>(null)

  handleOpen = output()
  handleSave = output()
  handleDelete = output()
}
