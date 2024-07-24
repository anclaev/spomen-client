import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { RemoveAvatarDto, UploadAvatarDto } from '@dtos'
import { UploadModel } from '@models'

import { API } from '@enums'

import { env } from '@env'

/**
 * Сервис для работы с аккаунтами
 */
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http: HttpClient = inject(HttpClient)

  uploadAvatar(dto: UploadAvatarDto) {
    const body = new FormData()

    body.append('file', dto.file as unknown as Blob)

    if (dto.id) body.append('id', dto.id)

    return this.http.post<UploadModel>(
      `${env.apiUrl}${API.ACCOUNT_AVATAR}`,
      body
    )
  }

  removeAvatar(dto: RemoveAvatarDto) {
    return this.http.delete<UploadModel>(
      `${env.apiUrl}${API.ACCOUNT_AVATAR}${dto.id ? `?id=${dto.id}` : ''}`
    )
  }
}
