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

      let isSignPage = path!.includes('/sign-in')

      if (path!.includes('/auth/callback') && !isAuthenticated) return true

      if (isSignPage) {
        if (!isAuthenticated) return true
        else {
          router.navigate(['/'])
          return false
        }
      }

      if (!isAuthenticated) {
        router.navigate(['/auth/sign-in'])
        return false
      }

      return true
    })
  )
}
