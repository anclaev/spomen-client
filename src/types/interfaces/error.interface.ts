export interface ApiError {
  path: string
  status: string
  message: string
  description?: string
}

export interface GraphqlError {
  code: number
  message: string
  description?: string
}
