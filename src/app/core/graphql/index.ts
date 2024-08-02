import { QueryRef } from 'apollo-angular'

export * from './graphql.provider'

export * from './mutations'
export * from './queries'
export * from './models'

export type Pagination = {
  page: number
  size: number
}

export type PaginatedQuery<T, V> = QueryRef<T, Pagination & V>
