import type { Response } from 'express';
import HttpServer from '../HttpServer';
import { ModulesMiddleware } from '../middleware';
import AuthRoute from './AuthRoute';

/**
 * Initialize all routes for the server
 * @param server Server instance
 */
export const initRoutes = (server: HttpServer): void => {
  const { options, application } = server;

  ModulesMiddleware.register(server);

  application.get(`${options.prefix}/health`, (_, res: Response) => {
    return res.send({ status: 'OK' });
  });

  application.use(`${options.prefix}/auth`, new AuthRoute(server).router);
  application.use('', (_, res: Response) => {
    return res
      .status(404)
      .json({ error: 'UNKNOWN_ENDPOINT', message: 'We could not find any referring endpoint.' });
  });
};
