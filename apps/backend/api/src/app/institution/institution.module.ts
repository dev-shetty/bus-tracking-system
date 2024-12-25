import { Module } from '@nestjs/common';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { DatabaseService } from '../../common/services/database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [InstitutionController],
  providers: [InstitutionService, DatabaseService, ConfigService],
})
export class InstitutionModule {}
