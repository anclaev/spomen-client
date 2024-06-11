import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

import { getQueryPayload } from '@utils/getQueryPayload'

import { SignInCallbackResponse } from '@tps/dto/sign-in-callback'

export const signInCallbackGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const payload = getQueryPayload<SignInCallbackResponse>(route.queryParams)

  if (payload && payload.token) {
    return true
  } else {
    router.navigate(['/sign-in'])
    return false
  }
}
