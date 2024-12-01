import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateInstitutionDto, UpdateInstitutionDto } from './dto/institution.dto';

@Injectable()
export class InstitutionService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    const result = await this.dbService.query('SELECT * FROM institution');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.dbService.query(
      'SELECT * FROM institution WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async create(createInstitutionDto: CreateInstitutionDto) {
    const result = await this.dbService.query(
      'INSERT INTO institution (name, contact, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        createInstitutionDto.name,
        createInstitutionDto.contact,
        createInstitutionDto.latitude,
        createInstitutionDto.longitude,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    const result = await this.dbService.query(
      'UPDATE institution SET name = $1, contact = $2, latitude = $3, longitude = $4 WHERE id = $5 RETURNING *',
      [
        updateInstitutionDto.name,
        updateInstitutionDto.contact,
        updateInstitutionDto.latitude,
        updateInstitutionDto.longitude,
        id,
      ]
    );
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.dbService.query(
      'DELETE FROM institution WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  async findBuses(institutionId: number) {
    const result = await this.dbService.query(
      `SELECT b.*, d.name as driver_name 
       FROM bus b 
       JOIN driver d ON b.driver_id = d.id 
       WHERE b.institution_id = $1`,
      [institutionId]
    );
    return result.rows;
  }
} 