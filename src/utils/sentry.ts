import * as Sentry from '@sentry/angular'

Sentry.init({
  dsn: 'https://bca4d211be7053a6af2a25b2145fab8a@o4506607592996864.ingest.us.sentry.io/4507531555635200',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
