import { Params } from '@angular/router'

export function getQueryPayload<T>(params: Params): T | null {
  return Object.keys(params).includes('payload')
    ? (JSON.parse(params['payload']) as T)
    : null
}
