import { gql } from 'apollo-angular'

export const getUploads = gql`
  query getUploads(
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

export const getUploadById = gql`
  query getUploadById($id: String!) {
    upload(where: { id: $id }) {
      id
      name
      ext
      url
      bucket
      is_system
      path
      url
      file_name
      permissions
      owner {
        id
        username
        first_name
        last_name
        avatar {
          url
        }
        vk_avatar
      }
      created_at
      updated_at
    }
  }
`

export const getExtensions = gql`
  query getExtensions($size: Float!, $page: Float!) {
    uploadExtensions(page: $page, size: $size)
  }
`
