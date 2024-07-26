import { gql, Query, QueryRef } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { Pagination } from '@graphql'
import { UploadModel } from '@models'

export type UploadsResponse = {
  uploads: UploadModel[]
}

export type UploadsVariables = Pagination & {
  owner?: string[]
  name?: string
  ext?: string[]
}

export type UploadsQueryRef = QueryRef<UploadsResponse, UploadsVariables>

export const UploadsQuery = gql`
  query uploads(
    $size: Float!
    $page: Float!
    $owner: [String!]
    $name: String
    $ext: [String!]
  ) {
    uploads(
      filters: {
        owner: { username: { in: $owner } }
        name: { contains: $name }
        ext: { in: $ext }
      }
      size: $size
      page: $page
    ) {
      id
      name
      ext
      file_name
      url
      permissions
      owner {
        id
        username
        avatar {
          url
        }
        vk_avatar
        first_name
        last_name
      }
      created_at
    }
  }
`

@Injectable()
export class UploadsGQL extends Query<UploadsResponse, UploadsVariables> {
  document = UploadsQuery
}
