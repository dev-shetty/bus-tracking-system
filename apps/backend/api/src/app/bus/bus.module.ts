import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { DatabaseService } from '../../common/services/database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BusController],
  providers: [BusService, DatabaseService, ConfigService],
  exports: [BusService],
})
export class BusModule {}
