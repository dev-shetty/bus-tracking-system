import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async login(loginDto: { email: string; password: string }) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.dbService.query(query, [loginDto.email]);

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      sub: user.id.toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.dbService.query(
        'SELECT * FROM users WHERE email = $1',
        [registerDto.email]
      );

      if (existingUser.rows.length > 0) {
        throw new UnauthorizedException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const query =
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)';

      await this.dbService.query(query, [
        registerDto.email,
        hashedPassword,
        registerDto.name,
        registerDto.role,
      ]);

      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException(
        'Failed to register user. Please try again later.'
      );
    }
  }
}
