import { Role } from '../enums/role.enum'

export const initialAccount = {
  id: null,
  vk_id: null,
  username: null,
  email: null,
  roles: [],
  avatar: null,
  first_name: null,
  last_name: null,
  full_name: null,
}

export interface Account {
  id: number | null
  vk_id: string | null
  username: string | null
  email: string | null
  roles: Role[]
  avatar: string | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
}
