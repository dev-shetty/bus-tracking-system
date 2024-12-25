import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateStudentDto } from '../student/dto/student.dto';

@Injectable()
export class BusService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAllDrivers() {
    const result = await this.dbService.query('SELECT * FROM driver');
    return result.rows;
  }

  async findAllRoutes() {
    const result = await this.dbService.query(`
      SELECT r.*, b.bus_no 
      FROM route r 
      JOIN bus b ON r.bus_id = b.id
    `);
    return result.rows;
  }

  async findBusStudents(busId: string) {
    const result = await this.dbService.query(`
      SELECT s.*, 
             array_agg(json_build_object('name', p.name, 'phone', p.phone)) as parents
      FROM student s
      LEFT JOIN parent_student ps ON s.id = ps.student_id
      LEFT JOIN parent p ON ps.phone = p.phone
      WHERE s.bus_id = $1
      GROUP BY s.id
    `, [busId]);
    return result.rows;
  }

  async addStudent(busId: string, createStudentDto: CreateStudentDto) {
    const client = await this.dbService.getPool().connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert student
      const studentResult = await client.query(
        'INSERT INTO student (name, home_latitude, home_longitude, bus_id, institution_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [
          createStudentDto.name,
          createStudentDto.home_latitude,
          createStudentDto.home_longitude,
          busId,
          createStudentDto.institution_id,
        ]
      );
      
      const studentId = studentResult.rows[0].id;

      // Insert parents and create relationships
      for (const parent of createStudentDto.parents) {
        await client.query(
          'INSERT INTO parent (phone, name, email) VALUES ($1, $2, $3) ON CONFLICT (phone) DO UPDATE SET name = $2, email = $3',
          [parent.phone, parent.name, parent.email]
        );

        await client.query(
          'INSERT INTO parent_student (student_id, phone) VALUES ($1, $2)',
          [studentId, parent.phone]
        );
      }

      await client.query('COMMIT');
      return { studentId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 