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
      let isSignInPage = router
        .getCurrentNavigation()
        ?.extractedUrl.toString()
        .includes('/sign-in')

      if (isSignInPage) {
        if (!isAuthenticated) return true
        else {
          router.navigate(['/'])
          return false
        }
      }

      if (!isAuthenticated) {
        router.navigate(['/sign-in'])
        return false
      }

      return true
    })
  )
}
