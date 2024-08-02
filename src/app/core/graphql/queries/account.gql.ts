import { gql, Query, QueryRef } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { AccountModel } from '@models'

export type AccountResponse = {
  account: AccountModel
}

export type AccountVariables = {
  username: string
}

export type AccountQueryRef = QueryRef<AccountResponse, AccountVariables>

@Injectable({
  providedIn: 'root',
})
export class AccountGQL extends Query<AccountResponse, AccountVariables> {
  document = gql`
    query account($username: String!) {
      account(where: { username: $username }) {
        id
        username
        email
        roles
        avatar {
          url
        }
        vk_id
        vk_avatar
        first_name
        last_name
        birthday
      }
    }
  `
}
