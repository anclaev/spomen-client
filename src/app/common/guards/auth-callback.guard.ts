import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { getQueryPayload } from '@utils/getQueryPayload'

import { AuthCallbackDto } from '@dto/auth-callback'

export const authCallbackGuard: CanActivateFn = (route, _) => {
  const router = inject(Router)

  const payload = getQueryPayload<AuthCallbackDto>(route.queryParams)

  return payload && payload.token
    ? true
    : router.createUrlTree(['/auth/sign-in'])
}
