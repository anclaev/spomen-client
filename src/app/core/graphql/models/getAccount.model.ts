import { Role } from '@enums'

export interface GetAccountModel {
  account: {
    id: string
    username: string
    email: string | null
    roles: Role[]
    avatar: {
      url: string
    } | null
    vk_id: string | null
    vk_avatar: string | null
    first_name: string | null
    last_name: string | null
    birthday: Date | null
    created_at: Date
    updated_at: Date
  }
}
