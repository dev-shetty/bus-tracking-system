import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBusDto {
  @ApiProperty({ description: 'Bus ID', example: 'KA19AB1234' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Driver ID', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  driverId: number;

  @ApiProperty({ description: 'Device ID', example: 'ABC-DEF-GHI' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
