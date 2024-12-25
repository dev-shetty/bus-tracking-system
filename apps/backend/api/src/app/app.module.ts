import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { BusModule } from './bus/bus.module';
import { LocationModule } from './location/location.module';
import { SmsService } from '../common/services/sms.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DatabaseService, JwtStrategy, SmsService, ConfigService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    InstitutionModule,
    BusModule,
    LocationModule,
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
