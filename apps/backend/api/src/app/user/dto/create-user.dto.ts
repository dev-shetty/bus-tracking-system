import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsOptional, IsNumber } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'User password' 
  })
  @IsString()
  password: string;

  @ApiProperty({ 
    example: 'John Doe',
    description: 'User full name' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    enum: Role,
    example: Role.INSTITUTION,
    description: 'User role (government or institution)' 
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ 
    example: 1,
    description: 'Institution ID (required for institution users)',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  institution_id?: number;
} 