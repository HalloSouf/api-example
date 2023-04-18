import { JwtHeader, JwtPayload } from 'jsonwebtoken';

export interface IConfig {
  name: string;
  environment: 'development' | 'production';
  port: number;
  url: string;
  keys: {
    privatePath: string;
    publicPath: string;
  };
  jwt: {
    audience: string;
    issuer: string;
  };
  isProduction: boolean;
}

export interface IHttpServerOptions extends IConfig {
  prefix: string;
}

export interface ICustomJwt {
  payload: JwtPayload;
  header: JwtHeader;
  signature: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: {
        jwt?: ICustomJwt;
        bearer?: string;
      };
    }
  }
}
