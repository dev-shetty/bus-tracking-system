import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: 'rohan',
  password: 'rohan',
  database: 'bus_tracking_db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations instead
};
