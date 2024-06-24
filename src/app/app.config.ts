import { provideHttpClient, withInterceptors } from '@angular/common/http'

import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withViewTransitions } from '@angular/router'
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { TUI_SANITIZER, TuiRootModule } from '@taiga-ui/core'
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import { provideRouterStore } from '@ngrx/router-store'
import { provideStore } from '@ngrx/store'
import { of } from 'rxjs'

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core'

import { httpRequestIntercepor } from '@interceptors/http.interceptor'
import { AuthService } from '@services/auth.service'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(TuiRootModule),
    provideStore(),
    provideRouterStore(),
    provideHttpClient(withInterceptors([httpRequestIntercepor])),
    AuthService,
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
  ],
}
