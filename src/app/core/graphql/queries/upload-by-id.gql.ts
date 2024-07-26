import { gql, Query, QueryRef } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { UploadModel } from '@models'

export type UploadByIdResponse = {
  upload: UploadModel
}

export type UploadByIdVariables = {
  id?: string
}

export type UploadByIdQueryRef = QueryRef<
  UploadByIdResponse,
  UploadByIdVariables
>

@Injectable()
export class UploadByIdGQL extends Query<
  UploadByIdResponse,
  UploadByIdVariables
> {
  document = gql`
    query upload($id: String!) {
      upload(where: { id: $id }) {
        id
        name
        ext
        url
        bucket
        is_system
        path
        url
        file_name
        permissions
        owner {
          id
          username
          first_name
          last_name
          avatar {
            url
          }
          vk_avatar
        }
        created_at
        updated_at
      }
    }
  `
}
