import { gql, Query, QueryRef } from 'apollo-angular'
import { Injectable } from '@angular/core'

import { AccountShortModel } from '@models'

export type AccountsInfoByUsernameResponse = {
  accounts: AccountShortModel[]
}

export type AccountsInfoByUsernameVariables = {
  username: string
}

export type AccountsInfoByUsernameQueryRef = QueryRef<
  AccountsInfoByUsernameResponse,
  AccountsInfoByUsernameVariables
>

@Injectable()
export class AccountsInfoByUsernameGQL extends Query<
  AccountsInfoByUsernameResponse,
  AccountsInfoByUsernameVariables
> {
  document = gql`
    query accountsInfoByUsername($username: String!) {
      accounts(
        filters: { username: { contains: $username } }
        size: 5
        page: 1
      ) {
        id
        username
        first_name
        last_name
      }
    }
  `
}
