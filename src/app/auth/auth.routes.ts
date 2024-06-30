import { Routes } from '@angular/router'

import { authCallbackGuard, authGuard } from '@guards'

import { AuthCallbackComponent } from './callback/auth-callback.component'
import { AuthComponent } from './auth.component'

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
    title: 'Spomen',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/404',
  },
]
