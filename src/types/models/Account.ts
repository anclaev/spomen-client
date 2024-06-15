import { Role } from '@tps/enums/role.enum'

export interface Account {
  id: number
  login: string
  email: string | null
  roles: Role[]
  avatarId: string | null
  vkId: string | null
  vkAvatar: string | null
  name: string | null
  surname: string | null
  birthday: Date | null
  createdAt: Date
  updatedAt: Date
}
