import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export default {
  validateBody: (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        error: 'INVALID_BODY',
        message: 'The body was not complete when receiving your request.'
      });

    next();
  }
};
