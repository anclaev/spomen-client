import { Routes } from '@angular/router'

import { DashboardComponent } from '@app/dashboard/dashboard.component'
import { SignInComponent } from '@app/sign-in/sign-in.component'

import { signInCallbackGuard } from '@common/guards/sign-in-callback.guard'
import { authGuard } from '@common/guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [authGuard],
    title: 'Вход',
  },
  {
    path: 'sign-in/callback',
    loadComponent: () =>
      import('./sign-in/sign-in-callback/sign-in-callback.component').then(
        (m) => m.SignInCallbackComponent
      ),
    canActivate: [authGuard, signInCallbackGuard],
    title: 'Вход',
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
]
