import { Routes } from '@angular/router'

import { DashboardComponent } from '@app/dashboard/dashboard.component'
import { SignInComponent } from '@app/sign-in/sign-in.component'

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
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
]
