import { Account } from './account.interface'

export const initialAuthenticatedUser: AuthenticatedUser = {
  id: null,
  vk_id: null,
  username: null,
  email: null,
  roles: [],
  avatar: null,
  vk_avatar: null,
  first_name: null,
  last_name: null,
  sex: null,
  full_name: null,
  token: null,
  birthday: null,
}

export interface AuthenticatedUser extends Account {
  token: string | null
}
