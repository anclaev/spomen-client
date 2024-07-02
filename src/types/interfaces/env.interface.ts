export interface Env {
  environment: 'local' | 'dev' | 'staging' | 'production'
  appId: number
  redirectUrl: string
  apiUrl: string
  origin: string
  sentryDsn: string
}
