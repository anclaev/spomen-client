import { Account } from './Account'

export interface Auth extends Account {
  access_token: string
}
