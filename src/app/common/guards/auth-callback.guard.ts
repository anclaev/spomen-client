import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'

export const authCallbackGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const payload = getQueryPayload<AuthCallbackResponse>(route.queryParams)

  if (payload && payload.token) {
    return true
  } else {
    router.navigate(['/auth/sign-in'])
    return false
  }
}
