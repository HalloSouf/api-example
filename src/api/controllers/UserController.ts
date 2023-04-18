import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

class UserController extends Controller {
  private userService: UserService = new UserService();
  private authService: AuthService = new AuthService();

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
        if (ex.code  === 'P2002' && ex.meta?.target === 'users_email_key') {
          return res.status(400).json({ error: 'DUPLICATE EMAIL', message: `Email "${email}" is already used.` });
        }

        if (ex.code === 'P2002' && ex.meta?.target === 'users_username_key') {
          return res.status(400).json({ error: 'DUPLICATE USERNAME', message: `Username "${username}" is already used.` });
        }
      }

      this.logger.error(ex);
      return res.status(500).json({ error: 'UNKNONW_ERROR', message: 'Error while resolving your request.' });
    }
  }
}

export default UserController;
