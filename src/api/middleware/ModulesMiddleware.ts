import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import HttpServer from '../HttpServer';
import { json, urlencoded } from 'express';

export default {
  register: ({ application, options }: HttpServer) => {
    application.use(helmet());
    application.use(json());
    application.use(urlencoded({ extended: false }));
    application.use(
      cors({
        origin: options.isProduction ? options.url : '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
      })
    );
    application.use(morgan(options.isProduction ? 'short' : 'dev'));
  }
};
