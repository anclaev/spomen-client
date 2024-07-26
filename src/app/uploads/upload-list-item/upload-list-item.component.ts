import { TuiChipModule, TuiSkeletonModule } from '@taiga-ui/experimental'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'
import { TuiHintModule, TuiSvgModule } from '@taiga-ui/core'
import { CommonModule, DatePipe } from '@angular/common'
import { RouterModule } from '@angular/router'
import * as Sentry from '@sentry/angular'

import { UploadModel } from '@models'

@Component({
  selector: 'spomen-upload-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSkeletonModule,
    TuiLineClampModule,
    TuiChipModule,
    TuiHintModule,
    TuiAvatarModule,
    TuiSvgModule,
  ],
  providers: [DatePipe],
  templateUrl: './upload-list-item.component.html',
  styleUrl: './upload-list-item.component.scss',
})
@Sentry.TraceClass({ name: 'UploadListItem' })
export class UploadListItemComponent {
  @Input('upload') upload: UploadModel | null = null
  @Input('isLoading') isLoading: boolean = false
  @Input('isPrivate') isPrivate: boolean = false

  @Output('clickUpload') clickUpload: EventEmitter<any> = new EventEmitter()
  @Output('selectExtension') selectExtension: EventEmitter<any> =
    new EventEmitter()

  handleClickUpload() {
    this.clickUpload.emit()
  }

  handleSelectExtension() {
    this.selectExtension.emit()
  }
}
