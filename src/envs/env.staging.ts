import { version } from '../../package.json'

import { Env } from '@interfaces'

export const env: Env = {
  environment: 'staging',
  appId: 0,
  redirectUrl: '',
  apiUrl: '',
  origin: '',
  sentryDsn: '',
  appVersion: `v${version}` ?? 'latest',
}
