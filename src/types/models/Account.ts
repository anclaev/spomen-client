import { Role } from '@enums/role.enum'

export interface Account {
  id: number
  username: string
  email: string | null
  roles: Role[]
  avatar_id: string | null
  vk_id: string | null
  vk_avatar: string | null
  first_name: string | null
  last_name: string | null
  birthday: Date | null
  created_at: Date
  updated_at: Date
}
