import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    // For demo purposes, using hardcoded credentials
    // In production, validate against database
    if (loginDto.email === 'govt@govt.com' && loginDto.password === 'govt123') {
      const payload = {
        username: loginDto.email,
        sub: '1',
        role: Role.GOVERNMENT,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    if (
      loginDto.email === 'institution@test.com' &&
      loginDto.password === 'inst123'
    ) {
      const payload = {
        username: loginDto.email,
        sub: '2',
        role: Role.INSTITUTION,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
