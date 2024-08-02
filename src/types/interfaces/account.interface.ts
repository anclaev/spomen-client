import { Sex } from '@interfaces'
import { Role } from '@enums'

export const initialAccount: Account = {
  id: null,
  vk_id: null,
  username: null,
  email: null,
  roles: [],
  avatar: null,
  vk_avatar: null,
  first_name: null,
  last_name: null,
  full_name: null,
  sex: null,
  birthday: null,
}

export interface Account {
  id: string | null
  vk_id: string | null
  username: string | null
  email: string | null
  roles: Role[]
  avatar: string | null
  vk_avatar: string | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  birthday: Date | null
  sex: Sex | null
}
