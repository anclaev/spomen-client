import { TuiAvatarModule, TuiLineClampModule } from '@taiga-ui/kit'

import { Component, computed, inject, input, output } from '@angular/core'

import { TuiAlertService, TuiHintModule, TuiSvgModule } from '@taiga-ui/core'

import {
  TuiButtonModule,
  TuiChipModule,
  TuiSkeletonModule,
} from '@taiga-ui/experimental'

import { TuiPreviewModule } from '@taiga-ui/addon-preview'

import { CommonModule, DatePipe } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
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
    TuiPreviewModule,
    TuiButtonModule,
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
  alerts = inject(TuiAlertService)
  router = inject(Router)

  upload = input.required<UploadModel | null>()
  isPrivate = input.required<boolean>()
  isLoading = input.required<boolean>()

  showPreview = output<UploadModel>()
  clickUpload = output()
  selectExtension = output()

  avatarUrl = computed(() =>
    this.upload()!.owner
      ? this.upload()!.owner!.avatar && this.upload()!.owner!.avatar!.url
        ? this.upload()!.owner!.avatar!.url
        : this.upload()!.owner!.vk_avatar
      : null
  )

  owner = computed(() =>
    this.upload()!.owner
      ? this.upload()!.owner!.first_name && this.upload()!.owner!.last_name
        ? this.upload()!.owner!.first_name +
          ' ' +
          this.upload()!.owner!.last_name
        : this.upload()!.owner!.username
      : 'System'
  )

  index = 0
}
