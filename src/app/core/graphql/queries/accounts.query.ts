import { gql } from 'apollo-angular'

export const getAccountQuery = gql`
  query getAccount($username: String!) {
    account(args: { username: $username }) {
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

export const getAccountsInfoByUsernameQuery = gql`
  query getAccountsInfoByUsername($username: String!) {
    accounts(filter: { username: { contains: $username } }, size: 5, page: 1) {
      id
      username
      first_name
      last_name
    }
  }
`
