import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouterStore } from '@ngrx/router-store'
import { provideRouter } from '@angular/router'
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
    provideRouter(routes),
    importProvidersFrom(TuiRootModule),
    provideStore(),
    provideRouterStore(),
    AuthStore,
  ],
}
