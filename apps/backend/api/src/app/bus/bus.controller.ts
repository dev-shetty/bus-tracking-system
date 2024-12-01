import { Controller, Injectable, UseGuards } from '@nestjs/common';
import { Body, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateBusDto } from './dto/bus.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bus')
@UseGuards(AuthGuard('jwt'))
export class BusController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post()
  async createBusEntry(@Body() busData: CreateBusDto) {
    const query = `
      INSERT INTO bus (bus_no, institution_id, driver_id, device_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    
    const values = [
      busData.bus_no,
      busData.institution_id,
      busData.driver_id,
      busData.device_id
    ];

    const result = await this.dbService.query(query, values);
    return result.rows[0];
  }

  @Get()
  async getAllBusEntries() {
    const query = `
      SELECT b.*, i.name as institution_name, d.name as driver_name
      FROM bus b
      JOIN institution i ON b.institution_id = i.id
      JOIN driver d ON b.driver_id = d.id`;
    
    const result = await this.dbService.query(query);
    return result.rows;
  }

  @Get(':id')
  async getBusEntry(@Param('id') id: string) {
    const query = `
      SELECT b.*, i.name as institution_name, d.name as driver_name
      FROM bus b
      JOIN institution i ON b.institution_id = i.id
      JOIN driver d ON b.driver_id = d.id
      WHERE b.id = $1`;
    
    const result = await this.dbService.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error('Bus not found');
    }
    return result.rows[0];
  }

  @Put(':id')
  async updateBusEntry(@Param('id') id: string, @Body() busData: CreateBusDto) {
    const query = `
      UPDATE bus 
      SET bus_no = $1, institution_id = $2, driver_id = $3, device_id = $4
      WHERE id = $5
      RETURNING *`;
    
    const values = [
      busData.bus_no,
      busData.institution_id,
      busData.driver_id,
      busData.device_id,
      id
    ];

    const result = await this.dbService.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('Bus not found');
    }
    return result.rows[0];
  }

  @Delete(':id')
  async deleteBusEntry(@Param('id') id: string) {
    const query = 'DELETE FROM bus WHERE id = $1 RETURNING *';
    const result = await this.dbService.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Bus not found');
    }
    return result.rows[0];
  }
}
