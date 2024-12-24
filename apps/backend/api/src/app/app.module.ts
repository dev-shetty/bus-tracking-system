import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { BusController } from './bus/bus.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { BusModule } from './bus/bus.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '../common/services/database.module';

@Module({
  controllers: [BusController, AuthController],
  providers: [DatabaseService, JwtStrategy],
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    InstitutionModule,
    BusModule,
    UserModule,
  ],
})

// When '/api' is accessed, it returns a simple status check response
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
