import { version } from '../../package.json'

import { Env } from '@interfaces'

export const env: Env = {
  environment: 'local',
  appId: 0,
  redirectUrl: '',
  apiUrl: '',
  origin: '',
  sentryDsn:
    'https://bca4d211be7053a6af2a25b2145fab8a@o4506607592996864.ingest.us.sentry.io/4507531555635200',
  appVersion: `v${version}` ?? 'latest',
}
