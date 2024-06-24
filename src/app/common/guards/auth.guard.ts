import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { map } from 'rxjs'

import { AuthService } from '@services'
import { getCurrentPath } from '@utils'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)

  const router = inject(Router)

  const currentPath = getCurrentPath(router)
  const isAuthPage = currentPath!.includes('/auth')

  return auth.$$isAuth.pipe(
    map((isAuth) => {
      if (
        (currentPath.includes('/auth/callback') && isAuth) ||
        (isAuthPage && !isAuth)
      ) {
        return true
      }

      if (isAuthPage && isAuth) {
        return router.createUrlTree(['/'])
      }

      if (isAuth) {
        return true
      }

      return router.createUrlTree(['/auth'])
    })
  )
}
