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
