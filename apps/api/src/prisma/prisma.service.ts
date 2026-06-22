import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  private client: any;

  constructor() {
    // Initialize Prisma client without type safety for now
    try {
      const PrismaClient = require('@prisma/client').PrismaClient;
      this.client = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize Prisma:', err);
    }
  }

  async onModuleInit() {
    if (this.client && this.client.$connect) {
      await this.client.$connect();
    }
  }

  async onModuleDestroy() {
    if (this.client && this.client.$disconnect) {
      await this.client.$disconnect();
    }
  }

  // Allow dynamic access to any model
  [key: string]: any;
}
