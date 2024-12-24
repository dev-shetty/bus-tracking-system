import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocationService } from './location.service';

@ApiTags('Location')
@ApiBearerAuth()
@Controller('location')
@UseGuards(AuthGuard('jwt'))
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':vehicleNumber')
  @ApiOperation({ summary: 'Get latest location of a vehicle' })
  @ApiParam({ name: 'vehicleNumber', description: 'Vehicle Number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the latest location of the specified vehicle.',
    schema: {
      type: 'object',
      properties: {
        vehicleNumber: { type: 'string' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        location: { type: 'string' },
        speed: { type: 'number' },
        ignition: { type: 'boolean' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Vehicle not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Error fetching vehicle location' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getVehicleLocation(@Param('vehicleNumber') vehicleNumber: string) {
    return await this.locationService.getVehicleLocation(vehicleNumber);
  }

  @Get('history/:vehicleNumber')
  @ApiOperation({ summary: 'Get location history of a vehicle' })
  @ApiParam({ name: 'vehicleNumber', description: 'Vehicle Number' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filter by date (YYYY-MM-DD)',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the location history of the specified vehicle.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          vehicleNumber: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          location: { type: 'string' },
          speed: { type: 'number' },
          ignition: { type: 'boolean' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Error fetching location history' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getLocationHistory(
    @Param('vehicleNumber') vehicleNumber: string,
    @Query('date') date?: string
  ) {
    return await this.locationService.getLocationHistory(vehicleNumber, date);
  }
}
