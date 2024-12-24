import { UserRole } from '../../../types/user.types';
import { IsEmail, IsString, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
