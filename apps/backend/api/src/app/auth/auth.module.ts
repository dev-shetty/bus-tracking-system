import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseService } from '../../common/services/database.service';
import { ConfigService } from '@nestjs/config';
import { SmsService } from '../../common/services/sms.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, ConfigService, SmsService],
  exports: [AuthService],
})
export class AuthModule {}
