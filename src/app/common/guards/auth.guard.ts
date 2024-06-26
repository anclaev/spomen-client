import { CanActivateFn, Router } from '@angular/router'
import { filter, map, withLatestFrom } from 'rxjs'
import { inject } from '@angular/core'

import { AuthService } from '@services'
import { getCurrentPath } from '@utils'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  const currentPath = getCurrentPath(router)
  const isAuthPage = currentPath.includes('/auth')

  return auth.$$isAuth.pipe(
    withLatestFrom(auth.$$loading),
    filter(([_, loading]) => !loading),
    map(([isAuth]) => {
      if (
        (currentPath.includes('/auth/callback') && isAuth) ||
        (isAuthPage && !isAuth)
      ) {
        return true
      }

      if (isAuthPage && isAuth) {
        return router.createUrlTree(['/'])
      }

      return isAuth
        ? true
        : router.createUrlTree(['/auth'], {
            queryParams: { url: currentPath },
          })
    })
  )
}
