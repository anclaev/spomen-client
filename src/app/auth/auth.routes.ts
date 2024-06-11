import { Routes } from '@angular/router'

import { authCallbackGuard } from '@common/guards/auth-callback.guard'
import { authGuard } from '@common/guards/auth.guard'

import { AuthCallbackComponent } from './callback/auth-callback.component'
import { SignInComponent } from './sign-in/sign-in.component'

export const authRoutes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [authGuard],
    title: 'Вход',
  },
  {
    path: 'callback',
    component: AuthCallbackComponent,
    canActivate: [authGuard, authCallbackGuard],
    title: 'Вход',
  },
]
