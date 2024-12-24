import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../common/services/database.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dbService: DatabaseService
  ) {}

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
