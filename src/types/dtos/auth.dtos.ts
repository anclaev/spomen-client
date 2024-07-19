export type AuthCallbackDto = {
  token: string
  type: string
  uuid: string
}

export type SignInDto = {
  username: string
  password: string
}

export type SignUpDto = {
  username: string
  password: string
  first_name?: string
  last_name?: string
  email?: string
  birthday?: string
}
