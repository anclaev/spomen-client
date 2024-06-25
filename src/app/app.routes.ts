import { Routes } from '@angular/router'

import { DashboardComponent } from '@app/dashboard/dashboard.component'

import { authGuard } from '@guards'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Воспоминания',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: ':username',
    loadComponent: () =>
      import('./profile/profile.component').then((c) => c.ProfileComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    pathMatch: 'full',
    title: 'Упс...',
  },
]
