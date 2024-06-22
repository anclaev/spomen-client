import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { AuthStore } from '@store/auth'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore)
  const router = inject(Router)

  const currentPath = router.getCurrentNavigation()!.extractedUrl.toString()
  const isAuthPage = currentPath!.includes('/auth')
  const isAuth = auth.isAuthenticated()

  if (
    (currentPath.includes('/auth/callback') && isAuth) ||
    (isAuthPage && !isAuth)
  )
    return true

  if (isAuthPage && isAuth) {
    return router.createUrlTree(['/'])
  }

  if (isAuth) return true

  return router.createUrlTree(['/auth'])
}
