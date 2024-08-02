import { HttpInterceptorFn } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'

import { env } from '@env'

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    withCredentials: true,
    headers: req.headers
      .set('Access-Control-Allow-Origin', env.origin)
      .set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      .set(
        'Access-Control-Allow-Headers',
        'Accept, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, sentry-trace, baggage'
      )
      .set('Access-Control-Allow-Credentials', 'true'),
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
