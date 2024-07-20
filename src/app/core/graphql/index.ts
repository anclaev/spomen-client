export * from './graphql.provider'
export * from './queries'
export * from './models'

import { QueryRef } from 'apollo-angular'

export type Pagination = {
  page: number
  size: number
}

export type PaginatedQuery<T, V> = QueryRef<T, Pagination & V>
