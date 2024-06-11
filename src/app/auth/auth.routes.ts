import { Routes } from '@angular/router'

import { authCallbackGuard } from '@common/guards/auth-callback.guard'
import { authGuard } from '@common/guards/auth.guard'

import { AuthCallbackComponent } from './callback/auth-callback.component'
import { AuthComponent } from './auth.component'
import { SignInComponent } from './sign-in/sign-in.component'

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [authGuard],
    title: 'Добро пожаловать',
  },
  {
    path: 'callback',
    component: AuthCallbackComponent,
    canActivate: [authGuard, authCallbackGuard],
    title: 'Вход',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/404',
  },
]
