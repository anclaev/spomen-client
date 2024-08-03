import { gql, Mutation } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { Permission } from '@enums'

export type UpdateUploadByIdResponse = {
  updateUpload: {
    id: string
    url: string
    name: string
    file_name: string
    permissions: Permission[]
  }
}

export type UpdateUploadByIdVariables = {
  data: {
    name?: string
    file_name?: string
    permissions?: Permission[]
  }
  id: string
}

export const UpdateUploadByIdQuery = gql`
  mutation updateUploadById($data: UploadUpdateInput!, $id: String!) {
    updateUpload(data: $data, where: { id: $id }) {
      id
      url
      name
      file_name
      permissions
    }
  }
`

@Injectable()
export class UpdateUploadByIdGQL extends Mutation<
  UpdateUploadByIdResponse,
  UpdateUploadByIdVariables
> {
  document = UpdateUploadByIdQuery
}
