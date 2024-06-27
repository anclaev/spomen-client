import { gql } from 'apollo-angular'

export const getAccountQuery = gql`
  query Account($username: String!) {
    account(id: $username) {
      id
      username
      email
      roles
      avatar {
        upload {
          url
        }
      }
      vk_id
      vk_avatar
      first_name
      last_name
      birthday
    }
  }
`
