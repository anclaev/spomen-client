import { Routes } from '@angular/router'

import { DashboardComponent } from '@app/dashboard/dashboard.component'

import { authGuard } from '@guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes),
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
