import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async checkConnection() {
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
