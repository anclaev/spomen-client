import { AccountModel } from './account.model'

export interface AuthModel extends AccountModel {
  access_token: string
  refresh_token: string
}
