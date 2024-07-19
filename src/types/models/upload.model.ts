import { AccountModel } from '@models'
import { Permission } from '@enums'

export interface UploadModel {
  id: string
  bucket: string
  name: string
  ext: string
  file_name: string
  path: string
  url: string
  owner_id: string
  owner?: AccountModel
  permissions: Permission[]
  is_system: boolean
  created_at: Date
  updated_at: Date
}
