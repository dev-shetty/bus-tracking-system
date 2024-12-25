import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.twilioClient = new twilio.Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );
  }

  async sendSMS(to: string, message: string) {
    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        to,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
      });

      return {
        success: true,
        messageId: response.sid,
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendOTP(to: string, otp: string) {
    const message = `Your verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
    return this.sendSMS(to, message);
  }
}
