import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { AuthCallbackDto } from '@dtos'
import { getQueryPayload } from '@utils'

export const authCallbackGuard: CanActivateFn = (route) => {
  const router = inject(Router)

  const payload = getQueryPayload<AuthCallbackDto>(route.queryParams)

  return payload && payload.token
    ? true
    : router.createUrlTree(['/auth/sign-in'])
}
