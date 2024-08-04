import * as Sentry from '@sentry/angular'
import { env } from '@env'

export function initSentry(): void {
  Sentry.init({
    dsn: env.sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', env.apiUrl],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: env.environment,
    enabled: env.environment !== 'local',
  })
}
