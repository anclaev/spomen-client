import { Router, provideRouter, withViewTransitions } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { provideServiceWorker } from '@angular/service-worker'
import { TUI_SANITIZER, TuiRootModule } from '@taiga-ui/core'
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import * as Sentry from '@sentry/angular'
import { of } from 'rxjs'

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
  ErrorHandler,
  LOCALE_ID,
  isDevMode,
} from '@angular/core'

import {
  AuthService,
  ConfigService,
  AccountService,
  UploadService,
  ScrollService,
  PwaService,
} from '@services'

import { httpRequestInterceptor } from '@interceptors'
import { AccountGQL, graphqlProvider } from '@graphql'
import { initSentry } from '@utils'

import { routes } from './app.routes'

function appInitializerFactory(config: ConfigService) {
  return async () => {
    await config.loadConfig()
    initSentry()
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(TuiRootModule),
    provideHttpClient(withInterceptors([httpRequestInterceptor])),
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [ConfigService, Sentry.TraceService],
      multi: true,
    },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
    { provide: LOCALE_ID, useValue: 'ru' },
    graphqlProvider,
    provideServiceWorker('ngsw-worker.js', {
      // enabled: !isDevMode(),
      enabled: false,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    PwaService,
    ConfigService,
    AuthService,
    AccountService,
    UploadService,
    ScrollService,
    AccountGQL,
  ],
}
