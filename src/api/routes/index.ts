import type { Response } from 'express';
import HttpServer from '../HttpServer';
import { ModulesMiddleware } from '../middleware';

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
};
