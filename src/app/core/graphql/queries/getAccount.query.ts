import { gql } from 'apollo-angular'

export const getAccountQuery = gql`
  query Account($username: String!) {
    account(username: $username) {
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
