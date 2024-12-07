import { ApiProperty } from '@nestjs/swagger';
import { CreateBusDto } from './bus.dto';

export class UpdateBusDto extends CreateBusDto {
  @ApiProperty({ example: 1, description: 'Bus ID' })
  id: number;
} 