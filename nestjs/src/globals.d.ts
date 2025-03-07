export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOG_LEVEL: 'info' | 'error' | 'debug'
      NODE_ENV: 'development' | 'production' | 'test' | 'staging' | 'docker'
      PORT: number
      SLACK_WEBHOOK_CHANNEL_NAME: ''
      SLACK_WEBHOOK_URL: ''
    }
  }
}
