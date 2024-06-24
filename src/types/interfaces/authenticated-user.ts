import { Role } from '@enums/role.enum'

export const initial: AuthenticatedUser = {
  id: null,
  vk_id: null,
  username: null,
  email: null,
  roles: [],
  avatar: null,
  first_name: null,
  last_name: null,
  token: null,
}

export interface AuthenticatedUser {
  id: number | null
  vk_id: string | null
  username: string | null
  email: string | null
  roles: Role[]
  avatar: string | null
  first_name: string | null
  last_name: string | null
  token: string | null
}
