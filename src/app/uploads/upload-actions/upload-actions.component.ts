import { TuiPreviewActionModule } from '@taiga-ui/addon-preview'
import { Component, input, output } from '@angular/core'
import { TuiSvgModule } from '@taiga-ui/core'
import * as Sentry from '@sentry/angular'

import { UploadActionsParams } from '@interfaces'

@Component({
  selector: 'spomen-upload-actions',
  standalone: true,
  imports: [TuiSvgModule, TuiPreviewActionModule],
  templateUrl: './upload-actions.component.html',
  styleUrl: './upload-actions.component.scss',
})
@Sentry.TraceClass({ name: 'UploadActions' })
export class UploadActionsComponent {
  _actions = input.required<UploadActionsParams>({ alias: 'actions' })
  url = input.required<string>()

  handleOpen = output()
  handleSave = output()
  handleDelete = output()
}
