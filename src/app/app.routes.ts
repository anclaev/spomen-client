import { Routes } from '@angular/router'

import { DashboardComponent } from '@app/dashboard/dashboard.component'

import { authGuard } from '@guards'

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Дашборд',
  },
  {
    path: 'memories',
    loadComponent: () =>
      import('./memories/memories.component').then((c) => c.MemoriesComponent),
    canActivate: [authGuard],
    title: 'Воспоминания',
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./events/events.component').then((c) => c.EventsComponent),
    canActivate: [authGuard],
    title: 'События',
  },
  {
    path: 'timelines',
    loadComponent: () =>
      import('./timelines/timelines.component').then(
        (c) => c.TimelinesComponent
      ),
    canActivate: [authGuard],
    title: 'Таймлайны',
  },
  {
    path: 'chats',
    loadComponent: () =>
      import('./chats/chats.component').then((c) => c.ChatsComponent),
    canActivate: [authGuard],
    title: 'Чаты',
  },
  {
    path: 'uploads',
    loadComponent: () =>
      import('./uploads/uploads.component').then((c) => c.UploadsComponent),
    canActivate: [authGuard],
    title: 'Файлы',
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
