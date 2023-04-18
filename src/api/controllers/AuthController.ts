import { Request, Response } from 'express';
import Controller from './Controller';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import { excludeField } from '../../utils/Utils';
import { User } from '@prisma/client';

class AuthController extends Controller {
  private userService: UserService = new UserService();
  private authService: AuthService = new AuthService();

  /**
   * Signin a user
   * @param req Express Request
   * @param res Express Response
   */
  public async signin(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    try {
      const user = await this.userService.find({
        where: { OR: [{ email: username }, { username: username }] }
      });

      if (!user || !this.authService.compareHash(password, user.password)) 
        throw new Error('INVALID_CREDENTIALS');

      const accessToken = this.authService.signToken({ id: user.id }, { expiresIn: '1h' });
      const refreshToken = this.authService.signToken({ id: user.id, accessToken });

      return res.json({
        user: excludeField<User, keyof User>(user, ['password']),
        accessToken,
        refreshToken
      });
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        if (ex.message === 'INVALID_CREDENTIALS') 
          return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Your credentials did not match.' });
      }

      this.logger.error(ex);
      return res.status(500).json({ error: 'UNKNOWN_ERROR', message: 'Error while resolving your request.' });
    }
  }
}

export default AuthController;
