import { PrismaClient } from '@prisma/client';
import UserSeeder from './UserSeeder';

/**
 * Main
 */
class Main {
  private readonly prisma: PrismaClient = new PrismaClient();

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Run all seeders
   */
  public async run(): Promise<void> {
    await new UserSeeder(this.prisma).run();
  }
}

new Main().run().catch(console.error);
