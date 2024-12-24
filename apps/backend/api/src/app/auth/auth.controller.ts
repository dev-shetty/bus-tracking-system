import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token',
    schema: {
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @ApiBody({
    description: 'User login details',
    examples: {
      user: {
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    description: 'User registration details',
    examples: {
      normal: {
        value: {
          email: 'user@example.com',
          password: 'password123',
          name: 'John Doe',
          role: 'normal',
        },
      },
      government: {
        value: {
          email: 'gov@gov.in',
          password: 'gov123',
          name: 'Government Admin',
          role: 'government',
        },
      },
      institution: {
        value: {
          email: 'admin@institution.edu',
          password: 'admin123',
          name: 'Institution Admin',
          role: 'institution',
        },
      },
    },
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
