import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{

  async onModuleInit() {
    console.log('Connecting to the database...');
    await this.$connect(); // PrismaClient's built-in method to open a database connection
  }

  // Automatically called when the module is destroyed
  async onModuleDestroy() {
    console.log('Disconnecting from the database...');
    await this.$disconnect(); // PrismaClient's built-in method to close the database connection
  }

  // Optional: You can add custom methods here for more specific functionalities if needed.
  async cleanDatabase() {
    // Example of a custom method that resets the entire database (use with caution)
    await this.$transaction([
      this.user.deleteMany(), // Assuming you have a user model
      this.post.deleteMany(), // Assuming you have a post model
      // Add more model deletions if needed
    ]);
  }
}
