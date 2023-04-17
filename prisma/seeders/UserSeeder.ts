import type { PrismaClient } from '@prisma/client';
import Seeder from './Seeder';
import { genSaltSync, hashSync } from 'bcrypt';

class UserSeeder extends Seeder {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super('User');
    this.prisma = prisma;
  }

  /**
   * Run seeder
   */
  public async run(): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          email: 'johndoe@gmail.com',
          firstname: 'John',
          lastname: 'Doe',
          password: hashSync('JohnPassword10!', genSaltSync(10)),
          username: 'johnnie'
        }
      });

      this.success();
    } catch (e: unknown) {
      this.failed(e as Error);
    }
  }
}

export default UserSeeder;
