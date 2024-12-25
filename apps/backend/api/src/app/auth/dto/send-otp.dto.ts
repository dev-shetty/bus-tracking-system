import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Parent mobile number with country code',
    example: '+919876543210',
  })
  @IsString()
  @Matches(/^\+[1-9]\d{10,14}$/, {
    message:
      'Invalid mobile number format. Must include country code (e.g., +919876543210)',
  })
  mobileNumber: string;
}
