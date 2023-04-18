import { Prisma, User } from '@prisma/client';
import Service from './Service';

class UserService extends Service {
  /**
   * Find a user
   * @param options Options to pass to the findFirst method
   */
  public async find(options: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(options);
  }
}

export default UserService;
