import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  imports: [ConfigModule],
  controllers: [LocationController],
  providers: [LocationService, DatabaseService],
})
export class LocationModule {} 