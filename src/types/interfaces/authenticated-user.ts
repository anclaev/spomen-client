import { Account } from '@tps/models/Account'

export interface AuthenticatedUser extends Account {
  access_token: string
}
