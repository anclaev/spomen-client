import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackResponse } from '@tps/dto/auth-callback'

export const authCallbackGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const payload = getQueryPayload<AuthCallbackResponse>(route.queryParams)

  return payload && payload.token
    ? true
    : router.createUrlTree(['/auth/sign-in'])
}
