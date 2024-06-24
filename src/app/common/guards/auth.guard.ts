import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { AuthService } from '@services/auth.service'

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = inject(AuthService).$isAuth()
  const router = inject(Router)

  const currentPath = router.getCurrentNavigation()!.extractedUrl.toString()
  const isAuthPage = currentPath!.includes('/auth')

  if (
    (currentPath.includes('/auth/callback') && isAuthenticated) ||
    (isAuthPage && !isAuthenticated)
  )
    return true

  if (isAuthPage && isAuthenticated) {
    return router.createUrlTree(['/'])
  }

  if (isAuthenticated) return true

  return router.createUrlTree(['/auth'])
}
