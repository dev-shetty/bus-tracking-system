import { ApiProperty } from '@nestjs/swagger';
import { CreateBusDto } from './bus.dto';

export class UpdateBusDto extends CreateBusDto {
  @ApiProperty({ example: 'KA19AE3048', description: 'Bus ID' })
  id: string;
}
