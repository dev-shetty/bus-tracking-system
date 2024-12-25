import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../common/services/database.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SmsService } from '../../common/services/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dbService: DatabaseService,
    private smsService: SmsService
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

  async sendParentOtp(sendOtpDto: SendOtpDto) {
    try {
      // Check if the mobile number is registered as a parent
      const parentQuery = `
        SELECT p.* FROM parent p
        INNER JOIN parent_student ps ON p.phone = ps.phone
        WHERE p.phone = REGEXP_REPLACE($1, '^\\+91', '')`;

      const parentResult = await this.dbService.query(parentQuery, [
        sendOtpDto.mobileNumber,
      ]);

      if (parentResult.rows.length === 0) {
        throw new UnauthorizedException(
          'Mobile number not registered as a parent'
        );
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiration time (5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Send OTP via SMS
      const smsResult = await this.smsService.sendOTP(
        sendOtpDto.mobileNumber.startsWith('+91')
          ? sendOtpDto.mobileNumber
          : '+91' + sendOtpDto.mobileNumber,
        otp
      );

      if (!smsResult.success) {
        throw new BadRequestException('Failed to send OTP via SMS');
      }

      // Store OTP in database

      const query = `
      INSERT INTO otp_storage (mobile_number, otp, expires_at)
        VALUES (REGEXP_REPLACE($1, '^\\+91', ''), $2, $3)
        ON CONFLICT (mobile_number)
        DO UPDATE SET 
          otp = EXCLUDED.otp,
          expires_at = EXCLUDED.expires_at,
          created_at = CURRENT_TIMESTAMP,
          is_verified = false
        RETURNING *`;

      const result = await this.dbService.query(query, [
        sendOtpDto.mobileNumber,
        otp,
        expiresAt,
      ]);

      return {
        message: 'OTP sent successfully',
        expiresAt,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to send OTP. Please try again later.'
      );
    }
  }

  async verifyParentOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      // Get stored OTP
      const query = `
        SELECT * FROM otp_storage 
        WHERE mobile_number = REGEXP_REPLACE($1, '^\\+91', '') 
        AND otp = $2 
        AND expires_at > NOW() 
        AND is_verified = false`;

      const result = await this.dbService.query(query, [
        verifyOtpDto.mobileNumber,
        verifyOtpDto.otp,
      ]);

      if (result.rows.length === 0) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      // Mark OTP as verified
      await this.dbService.query(
        'UPDATE otp_storage SET is_verified = true WHERE mobile_number = $1',
        [verifyOtpDto.mobileNumber]
      );

      // Get parent's students information with bus details
      const studentQuery = `
        SELECT 
          s.*,
          b.id as bus_id,
          b.device_id,
          i.name as institution_name
        FROM student s
        INNER JOIN parent_student ps ON ps.student_usn = s.usn
        INNER JOIN bus b ON s.bus_id = b.id
        INNER JOIN institution i ON s.institution_id = i.id
        WHERE ps.phone = REGEXP_REPLACE($1, '^\\+91', '')`;

      const studentsResult = await this.dbService.query(studentQuery, [
        verifyOtpDto.mobileNumber,
      ]);

      // Generate JWT token
      const payload = {
        mobileNumber: verifyOtpDto.mobileNumber,
        role: 'parent',
        students: studentsResult.rows.map((student) => ({
          usn: student.usn,
          name: student.name,
          year: student.year,
          busId: student.bus_id,
          deviceId: student.device_id,
          institutionName: student.institution_name,
          homeAddress: student.home_address,
          homeLocation: {
            latitude: parseFloat(student.home_latitude),
            longitude: parseFloat(student.home_longitude),
          },
        })),
      };

      return {
        access_token: this.jwtService.sign(payload),
        students: studentsResult.rows,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException(
        'Failed to verify OTP. Please try again later.'
      );
    }
  }
}
