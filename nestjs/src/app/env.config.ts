import { existsSync } from 'node:fs'

if (existsSync('.env')) {
  process.loadEnvFile()
}

export const {
  LOG_LEVEL = 'error',
  NODE_ENV = 'development',
  PORT = 3333,
  SLACK_WEBHOOK_CHANNEL_NAME = '',
  SLACK_WEBHOOK_URL = '',
  JWT_SECRET = 'someKey'
} = process.env
