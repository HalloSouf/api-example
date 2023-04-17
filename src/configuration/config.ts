import { IConfig } from 'src/types/global.interface';
import { config as insertEnv } from 'dotenv';
insertEnv();

export default {
  name: process.env.APP_NAME || 'api-example',
  environment: process.env.APP_ENV === 'production' ? 'production' : 'development',
  url: process.env.APP_URL || 'http://localhost',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  keys: {
    privatePath: process.env.PRIVATE_KEY_PATH || './keys/rsa-private-key.pem',
    publicPath: process.env.PUBLIC_KEY_PATH || './keys/rsa-public-key.pem'
  },
  jwt: {
    audience: process.env.APP_URL || 'http://localhost',
    issuer: process.env.APP_NAME || 'api-example'
  },
  isProduction: process.env.APP_ENV === 'production'
} as IConfig;
