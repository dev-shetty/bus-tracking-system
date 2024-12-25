import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SmsService } from './sms.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [DatabaseService, SmsService, ConfigService],
  exports: [DatabaseService, SmsService],
})
export class DatabaseModule {}
