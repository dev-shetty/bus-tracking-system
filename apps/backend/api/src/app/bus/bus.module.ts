import { Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [BusController],
  providers: [BusService, DatabaseService],
  exports: [BusService],
})
export class BusModule {}
