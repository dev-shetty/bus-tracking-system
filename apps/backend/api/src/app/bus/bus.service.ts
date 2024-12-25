import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateStudentDto } from '../student/dto/student.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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
    const result = await this.dbService.query(
      `
      SELECT s.*, 
             array_agg(json_build_object('name', p.name, 'phone', p.phone)) as parents
      FROM student s
      LEFT JOIN parent_student ps ON s.usn = ps.student_usn
      LEFT JOIN parent p ON ps.phone = p.phone
      WHERE s.bus_id = $1
      GROUP BY s.usn
    `,
      [busId]
    );
    return result.rows;
  }

  async addStudent(busId: string, createStudentDto: CreateStudentDto) {
    const client = await this.dbService.getPool().connect();

    try {
      await client.query('BEGIN');

      // Check if student with USN already exists
      const existingStudent = await client.query(
        'SELECT usn FROM student WHERE usn = $1',
        [createStudentDto.usn]
      );

      if (existingStudent.rows.length > 0) {
        throw new BadRequestException('Student with this USN already exists');
      }

      // Insert student
      // Get institution_id from bus table
      const busResult = await client.query(
        'SELECT institution_id FROM bus WHERE id = $1',
        [busId]
      );

      if (busResult.rows.length === 0) {
        throw new NotFoundException('Bus not found');
      }

      const institutionId = busResult.rows[0].institution_id;

      const studentResult = await client.query(
        'INSERT INTO student (name, usn, year, home_latitude, home_longitude, home_address, bus_id, institution_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [
          createStudentDto.name,
          createStudentDto.usn,
          createStudentDto.year,
          createStudentDto.home_latitude,
          createStudentDto.home_longitude,
          createStudentDto.home_address,
          busId,
          institutionId,
        ]
      );

      const studentId = studentResult.rows[0].id;

      // Insert parents and create relationships
      for (const parent of createStudentDto.parents) {
        await client.query(
          'INSERT INTO parent (phone, name) VALUES ($1, $2) ON CONFLICT (phone) DO UPDATE SET name = $2',
          [parent.phone, parent.name]
        );

        await client.query(
          'INSERT INTO parent_student (student_usn, phone) VALUES ($1, $2)',
          [createStudentDto.usn, parent.phone]
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

  async removeStudent(usn: string) {
    const client = await this.dbService.getPool().connect();

    try {
      await client.query('BEGIN');

      // Check if student exists
      const studentExists = await client.query(
        'SELECT usn FROM student WHERE usn = $1',
        [usn]
      );

      if (studentExists.rows.length === 0) {
        throw new NotFoundException('Student not found');
      }

      // Delete parent-student relationships
      await client.query('DELETE FROM parent_student WHERE student_usn = $1', [
        usn,
      ]);

      // Delete student
      const result = await client.query(
        'DELETE FROM student WHERE usn = $1 RETURNING *',
        [usn]
      );

      await client.query('COMMIT');
      return {
        success: true,
        message: 'Student removed successfully',
        data: result.rows[0],
      };
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to remove student',
        error: error.message,
      });
    } finally {
      client.release();
    }
  }

  async deleteBus(id: string) {
    // First check if bus has any associated students
    const checkStudentsQuery = `
      SELECT COUNT(*) FROM student WHERE bus_id = $1
    `;
    const studentsResult = await this.dbService.query(checkStudentsQuery, [id]);
    if (studentsResult.rows[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete bus with associated students'
      );
    }

    // Then check if bus has any routes
    const checkRoutesQuery = `
      SELECT COUNT(*) FROM route WHERE bus_id = $1
    `;
    const routesResult = await this.dbService.query(checkRoutesQuery, [id]);
    if (routesResult.rows[0].count > 0) {
      throw new BadRequestException('Cannot delete bus with associated routes');
    }

    const deleteQuery = `
      DELETE FROM bus WHERE id = $1
      RETURNING *`;

    const result = await this.dbService.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Bus not found');
    }
    return { message: 'Bus deleted successfully' };
  }
}
