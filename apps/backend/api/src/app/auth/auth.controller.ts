import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
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
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
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

  @ApiOperation({ summary: 'Send OTP to parent\'s mobile number' })
  @ApiBody({
    description: 'Parent mobile number',
    type: SendOtpDto,
    examples: {
      parent: {
        value: {
          mobileNumber: '+919876543210'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid mobile number' })
  @Post('parent/send-otp')
  async sendParentOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendParentOtp(sendOtpDto);
  }

  @ApiOperation({ summary: 'Verify parent OTP and get access token' })
  @ApiBody({
    description: 'OTP verification details',
    type: VerifyOtpDto,
    examples: {
      parent: {
        value: {
          mobileNumber: '+919876543210',
          otp: '123456'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  @Post('parent/verify-otp')
  async verifyParentOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyParentOtp(verifyOtpDto);
  }
}
