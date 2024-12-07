import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Get('/db')
  async checkDbConnection() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        message: 'Database connection is healthy',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }
}
