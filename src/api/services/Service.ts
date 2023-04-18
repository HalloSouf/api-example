import { PrismaClient } from '../../utils/Database';
import type { PrismaClient as IPrismaClient } from '@prisma/client';

class Service {
  /**
   * Prisma client instance
   */
  protected get prisma(): IPrismaClient  {
    return PrismaClient;
  }
}

export default Service;
