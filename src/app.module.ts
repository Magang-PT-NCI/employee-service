import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
