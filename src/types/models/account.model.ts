import { UploadModel } from '@models'
import { Role } from '@enums'

export interface AccountModel {
  id: string
  username: string
  email: string | null
  roles: Role[]
  avatar: UploadModel | null
  vk_id: string | null
  vk_avatar: string | null
  first_name: string | null
  last_name: string | null
  birthday: Date | null
  sex: '0' | '1' | '2'
  created_at: Date
  updated_at: Date
}
