import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ description: 'Driver name', example: 'Suresh Kumar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Driver phone number', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
