import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import {
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from './dto/institution.dto';

@Injectable()
export class InstitutionService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(institutionData: CreateInstitutionDto) {
    const query = `
      INSERT INTO institution (name, contact, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;

    const values = [
      institutionData.name,
      institutionData.contact,
      institutionData.latitude,
      institutionData.longitude,
    ];

    const result = await this.dbService.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = 'SELECT * FROM institution';
    const result = await this.dbService.query(query);
    return result.rows;
  }

  async findOne(id: string) {
    const query = 'SELECT * FROM institution WHERE id = $1';
    const result = await this.dbService.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Institution not found');
    }
    return result.rows[0];
  }

  async update(id: string, institutionData: UpdateInstitutionDto) {
    const query = `
      UPDATE institution 
      SET name = $1, contact = $2, latitude = $3, longitude = $4
      WHERE id = $5
      RETURNING *`;

    const values = [
      institutionData.name,
      institutionData.contact,
      institutionData.latitude,
      institutionData.longitude,
      id,
    ];

    const result = await this.dbService.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundException('Institution not found');
    }
    return result.rows[0];
  }

  async remove(id: string) {
    // Check for associated buses
    const checkBusesQuery =
      'SELECT COUNT(*) FROM bus WHERE institution_id = $1';
    const busesResult = await this.dbService.query(checkBusesQuery, [id]);
    if (busesResult.rows[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete institution with associated buses'
      );
    }

    // Check for associated students
    const checkStudentsQuery =
      'SELECT COUNT(*) FROM student WHERE institution_id = $1';
    const studentsResult = await this.dbService.query(checkStudentsQuery, [id]);
    if (studentsResult.rows[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete institution with associated students'
      );
    }

    const deleteQuery = 'DELETE FROM institution WHERE id = $1 RETURNING *';
    const result = await this.dbService.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Institution not found');
    }
    return {
      message: 'Institution deleted successfully',
      data: result.rows[0],
    };
  }
}
