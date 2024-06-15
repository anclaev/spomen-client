import { toObservable } from '@angular/core/rxjs-interop'
import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { map } from 'rxjs'

import { AuthStore } from '@store/auth'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore)
  const router = inject(Router)

  return toObservable(auth.isAuthenticated).pipe(
    map((isAuthenticated) => {
      let path = router.getCurrentNavigation()?.extractedUrl.toString()

      let isAuthPage = path!.includes('/auth')

      if (path!.includes('/auth/callback') && !isAuthenticated) return true

      if (!isAuthenticated && isAuthPage) {
        return true
      }

      if (isAuthPage && isAuthenticated) {
        router.navigate(['/'])
        return false
      }

      if (isAuthenticated) return true

      router.navigate(['/auth'])

      return false
    })
  )
}
