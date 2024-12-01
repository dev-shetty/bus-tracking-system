import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: { username: string; password: string }) {
    // For demo purposes, using hardcoded credentials
    // In production, validate against database
    if (loginDto.username === 'admin' && loginDto.password === 'admin123') {
      const payload = { username: loginDto.username, sub: '1' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
