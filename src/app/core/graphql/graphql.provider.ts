import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core'
import { offsetLimitPagination } from '@apollo/client/utilities'
import { ApplicationConfig, inject } from '@angular/core'
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { env } from '@env'

export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink)
  return {
    link: httpLink.create({
      uri: `${env.apiUrl}/graphql`,
      withCredentials: true,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            uploads: offsetLimitPagination(['page', 'size']),
          },
        },
      },
    }),
    connectToDevTools: true,
  }
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
]
