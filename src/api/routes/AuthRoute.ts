import { body } from 'express-validator';
import type HttpServer from '../HttpServer';
import AuthController from '../controllers/AuthController';
import Route from './Route';
import { GlobalMiddleware } from '../middleware';

class AuthRoute extends Route {
  private controller: AuthController = new AuthController();

  constructor(server: HttpServer) {
    super();
    this.init();
    server.emit('debug', 'Auth routes initialized.');
  }

  /**
   * Initialize the routes
   */
  private init(): void {
    this.router.post(
      '/signin',
      [
        body('username').isLength({ min: 1 }),
        body('password').isLength({ min: 1 }),
        GlobalMiddleware.validateBody
      ],
      this.controller.signin.bind(this.controller)
    );
  }
}

export default AuthRoute;
