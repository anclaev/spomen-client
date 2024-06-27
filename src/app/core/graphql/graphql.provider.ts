import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core'
import { ApplicationConfig, inject } from '@angular/core'
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { env } from '@env'

export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink)
  return {
    link: httpLink.create({ uri: `${env.apiUrl}/graphql` }),
    cache: new InMemoryCache(),
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
