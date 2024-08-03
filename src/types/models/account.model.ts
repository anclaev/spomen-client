import { UploadModel } from '@models'
import { Role } from '@enums'
import { Sex } from '@interfaces'

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
  sex: Sex | null
  created_at: Date
  updated_at: Date
}

export interface AccountShortModel {
  id: string
  username: string
  first_name: string | null
  last_name: string | null
}
