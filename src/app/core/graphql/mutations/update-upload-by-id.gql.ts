import { gql, Mutation } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { Permission } from '@enums'

export type UpdateUploadByIdResponse = {
  id: string
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
