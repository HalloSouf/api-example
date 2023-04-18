import { Prisma, User } from '@prisma/client';
import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import { excludeField } from '../../utils/Utils';

class UserController extends Controller {
  private userService: UserService = new UserService();
  private authService: AuthService = new AuthService();

  public async get(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    try {
      if (userId !== '@me' && req.auth?.jwt?.payload.id !== userId) throw new Error('NO_ACCESS');

      const user = await this.userService.find({ where: { id: userId } });
      if (!user) throw new Error('UNKNOWN_USER');

      return res.json({ ...excludeField<User, keyof User>(user, ['password']) });
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        if (ex.message === 'UNKNOWN_USER') {
          return res
            .status(404)
            .json({ error: 'UNKNOWN_USER', message: 'Could not find user with specified ID.' });
        }

        if (ex.message === 'NO_ACCESS') {
          return res
            .status(403)
            .json({ error: 'NO_ACCESS', message: 'You do not have access to this resource.' });
        }
      }

      this.logger.error(ex);
      return res
        .status(500)
        .json({ error: 'UNKNONW_ERROR', message: 'Error while resolving your request.' });
    }
  }

  /**
   * Create user
   * @param req Express request
   * @param res Express response
   */
  public async create(req: Request, res: Response): Promise<Response> {
    const { firstname, lastname, email, password, username } = req.body;

    try {
      const user = await this.userService.create({
        data: { firstname, lastname, email, password: this.authService.hash(password), username }
      });

      return res.json({ ...user });
    } catch (ex: unknown) {
      if (ex instanceof Prisma.PrismaClientKnownRequestError) {
        if (ex.code === 'P2002' && ex.meta?.target === 'users_email_key') {
          return res
            .status(400)
            .json({ error: 'DUPLICATE EMAIL', message: `Email "${email}" is already used.` });
        }

        if (ex.code === 'P2002' && ex.meta?.target === 'users_username_key') {
          return res.status(400).json({
            error: 'DUPLICATE USERNAME',
            message: `Username "${username}" is already used.`
          });
        }
      }

      this.logger.error(ex);
      return res
        .status(500)
        .json({ error: 'UNKNONW_ERROR', message: 'Error while resolving your request.' });
    }
  }
}

export default UserController;
