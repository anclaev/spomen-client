import { Role } from '@tps/enums/role.enum'

export type AuthState = {
  id: number | null
  vk_id: string | null
  login: string | null
  email: string | null
  roles: Role[]
  avatar: string | null
  first_name: string | null
  last_name: string | null
  token: string | null
  loading: boolean
}

export type RootState = AuthState
