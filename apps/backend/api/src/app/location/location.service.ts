import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../common/services/database.service';

@Injectable()
export class LocationService {
  private pgClient: Client;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService
  ) {
    this.pgClient = new Client({
      connectionString: this.configService.get('SUPABASE_URL'),
    });

    this.pgClient
      .connect()
      .then(() => console.log('Connected to external PostgreSQL Database'))
      .catch((err) => console.error('Connection error:', err.stack));
  }

  async getVehicleLocation(vehicleNumber: string) {
    try {
      // First get the device ID from the database
      const deviceQuery = `
        SELECT device_id FROM bus 
        WHERE id = $1 
        LIMIT 1`;

      const deviceResult = await this.databaseService.query(deviceQuery, [
        vehicleNumber,
      ]);

      if (deviceResult.rows.length === 0) {
        throw new NotFoundException('Vehicle not found');
      }

      const deviceId = deviceResult.rows[0].device_id;

      const response = await fetch(
        `https://api.wheelseye.com/currentLoc?accessToken=${deviceId}`
      );

      if (!response.ok) {
        throw new InternalServerErrorException(
          'Failed to fetch from Wheelseye API'
        );
      }

      const data = await response.json();

      if (!data?.success) {
        throw new InternalServerErrorException(
          'Failed to fetch location from Wheelseye'
        );
      }

      const vehicleData = data.data.list[0];
      return {
        vehicleNumber: vehicleData.vehicleNumber,
        latitude: vehicleData.latitude,
        longitude: vehicleData.longitude,
        location: vehicleData.location,
        speed: vehicleData.speed,
        ignition: vehicleData.ignition,
        timestamp: vehicleData.createdDate,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching vehicle location');
    }
  }

  async getLocationHistory(vehicleNumber: string, date?: string) {
    try {
      let query = `SELECT * FROM vehicle_data WHERE vehicleNum = $1`;
      const queryParams = [vehicleNumber];

      if (date) {
        query += ` AND DATE(time) = $2`;
        queryParams.push(new Date(date).toISOString());
      }

      query += ` ORDER BY time DESC`;
      const result = await this.pgClient.query(query, queryParams);

      return result.rows.map((row) => this.formatLocationData(row));
    } catch (error) {
      throw new InternalServerErrorException('Error fetching location history');
    }
  }

  private formatLocationData(row: any) {
    return {
      vehicleNumber: row.vehiclenum,
      latitude: row.lat,
      longitude: row.long,
      location: row.loc,
      speed: row.speed,
      ignition: row.ign,
      timestamp: row.time,
    };
  }
}
