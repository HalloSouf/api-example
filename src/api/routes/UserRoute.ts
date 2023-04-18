import { body } from 'express-validator';
import HttpServer from '../HttpServer';
import UserController from '../controllers/UserController';
import Route from './Route';
import { GlobalMiddleware } from '../middleware';

class UserRoute extends Route {
  private controller: UserController = new UserController();

  constructor(server: HttpServer) {
    super();
    this.init();
    server.emit('debug', 'User routes initialized.');
  }

  /**
   * Initialise the routes
   */
  private init(): void {
    this.router.post(
      '/',
      [
        body('password').isStrongPassword(),
        body('firstname').isLength({ min: 1 }),
        body('lastname').isLength({ min: 1 }),
        body('email').isEmail(),
        body('username').isLength({ min: 1 }),
        GlobalMiddleware.validateBody
      ],
      this.controller.create.bind(this.controller)
    );
    this.router.get(
      '/:userId',
      [GlobalMiddleware.getBearer, GlobalMiddleware.validateBearer],
      this.controller.get.bind(this.controller)
    );
  }
}

export default UserRoute;
