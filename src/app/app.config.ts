import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withViewTransitions } from '@angular/router'
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { TUI_SANITIZER, TuiRootModule } from '@taiga-ui/core'
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import { of } from 'rxjs'

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core'

import { httpRequestIntercepor } from '@interceptors'
import { AuthService, ConfigService } from '@services'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(TuiRootModule),
    provideHttpClient(withInterceptors([httpRequestIntercepor])),
    ConfigService,
    AuthService,
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
  ],
}
