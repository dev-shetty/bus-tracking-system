import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { BusController } from './bus/bus.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
@Module({
  controllers: [BusController, AuthController],
  providers: [DatabaseService, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        if (req.originalUrl === '/api') {
          res.json({ status: 'ok' });
          return;
        }
        next();
      })
      .forRoutes('*');
  }
}
