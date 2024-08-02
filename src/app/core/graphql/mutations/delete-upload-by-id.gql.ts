import { gql, Mutation } from 'apollo-angular'
import { Injectable } from '@angular/core'

export type DeleteUploadByIdResponse = {
  id: string
}

export type DeleteUploadByIdVariables = {
  id: string
}

export const DeleteUploadByIdQuery = gql`
  mutation deleteUploadById($id: String!) {
    deleteUpload(where: { id: $id }) {
      id
    }
  }
`

@Injectable()
export class DeleteUploadByIdGQL extends Mutation<
  DeleteUploadByIdResponse,
  DeleteUploadByIdVariables
> {
  document = DeleteUploadByIdQuery
}
