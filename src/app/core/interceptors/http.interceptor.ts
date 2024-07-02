import { catchError, throwError } from 'rxjs'
import {} from '@angular/core'

import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http'
import { env } from '@env'

export const httpRequestIntercepor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    withCredentials: true,
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': env.origin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'Accept, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, sentry-trace, baggage',
      'Access-Control-Allow-Credentials': 'true',
    }),
  })

  return next(req).pipe(
    catchError((err: Error) => {
      if (env.environment !== 'production') {
        console.log(err)
      }
      return throwError(() => err)
    })
  )
}
