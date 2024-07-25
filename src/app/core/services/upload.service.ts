import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { TuiFileLike } from '@taiga-ui/kit'

import { FileParams } from '@interfaces'

import { UploadFileDto } from '@dtos'
import { UploadModel } from '@models'

import { API, Permission } from '@enums'

import { env } from '@env'

/**
 * Сервис для загрузки файлов
 */
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http: HttpClient = inject(HttpClient)

  uploadFile(dto: UploadFileDto) {
    const body = new FormData()

    body.append('file', dto.file as unknown as Blob)
    body.append('path', dto.path)
    body.append('compress', dto.compress.toString())
    body.append('originalName', dto.file.name)

    if (dto.name) {
      body.append('name', dto.name)
    }

    if (dto.private) {
      body.append('acl', Permission.OwnerOnly)
    }

    return this.http.post<UploadModel>(`${env.apiUrl}${API.UPLOAD}`, body)
  }

  /**
   * Получение параметров файла
   * @param {TuiFileLike} file Файл tui-kit
   * @return {FileParams} Параметры файла
   */
  getFileParams(file: TuiFileLike): FileParams {
    const filename = file.name.split('.')
    const ext = filename[filename.length - 1]

    delete filename[filename.length - 1]

    return {
      name: filename.join('.').slice(0, filename.join('-').length - 1),
      ext,
      mime: file.type,
    }
  }
}
