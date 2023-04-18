import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Logger from '../../utils/Logger';
import AuthService from '../services/AuthService';

const authService = new AuthService();
const logger = new Logger();

export default {
  validateBody: (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        error: 'INVALID_BODY',
        message: 'The body was not complete when receiving your request.'
      });

    next();
  },
  getBearer: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const token =
        req.headers['authorization'] && req.headers['authorization'].split('Bearer ')[1];
      if (!token) throw new Error('NO_BEARER');

      req.auth = { bearer: token };
      next();
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'NO_BEARER')
          return res
            .status(401)
            .json({ error: 'NO_BEARER', message: 'No bearer token was found in your request.' });
      }

      logger.error(e);
      return res
        .status(500)
        .json({ error: 'UNKNOWN_ERROR', message: 'Error while resolving your request.' });
    }
  },
  validateBearer: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      if (!req.auth?.bearer) throw new Error('NO_BEARER');

      const jwt = await authService.verifyToken(req.auth.bearer);
      if (!jwt) throw new Error('UNAUTHORIZED');

      req.auth = { ...req.auth, jwt };
      next();
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'NO_BEARER')
          return res
            .status(400)
            .json({ error: 'NO_BEARER', message: 'No bearer token was found in your request.' });
        if (e.message === 'UNAUTHORIZED')
          return res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'You are not authorized to access this resource.'
          });
        if (e.message === 'jwt expired')
          return res
            .status(401)
            .json({ error: 'UNAUTHORIZED', message: 'Your access token has expired.' });
      }

      logger.error(e);
      return res
        .status(500)
        .json({ error: 'UNKNOWN_ERROR', message: 'Error while resolving your request.' });
    }
  }
};
