import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withViewTransitions } from '@angular/router'
import { provideRouterStore } from '@ngrx/router-store'
import { TuiRootModule } from '@taiga-ui/core'
import { provideStore } from '@ngrx/store'

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core'

import { AuthStore } from '@store/auth'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(TuiRootModule),
    provideStore(),
    provideRouterStore(),
    AuthStore,
  ],
}
