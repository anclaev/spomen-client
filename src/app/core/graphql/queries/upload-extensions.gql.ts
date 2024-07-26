import { gql, Query, QueryRef } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { Pagination } from '@graphql'

export type UploadExtensionsResponse = {
  uploadExtensions: string[]
}

export type UploadExtensionsVariables = Pagination & {}

export type UploadExtensionsQueryRef = QueryRef<
  UploadExtensionsResponse,
  UploadExtensionsVariables
>

@Injectable()
export class UploadExtensionsGQL extends Query<
  UploadExtensionsResponse,
  UploadExtensionsVariables
> {
  document = gql`
    query uploadExtensions($size: Float!, $page: Float!) {
      uploadExtensions(page: $page, size: $size)
    }
  `
}
