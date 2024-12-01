import { Module } from '@nestjs/common';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { DatabaseService } from '../../common/services/database.service';

@Module({
  controllers: [InstitutionController],
  providers: [InstitutionService, DatabaseService],
})
export class InstitutionModule {}
