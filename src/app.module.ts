import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpMiddleware } from './middlewares/http.middleware';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { ApikeyMiddleware } from './middlewares/apikey.middleware';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [AuthController, EmployeeController],
  providers: [AuthService, EmployeeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpMiddleware).forRoutes('*');
    consumer.apply(ApikeyMiddleware).forRoutes('/employee/:nik');
  }
}
