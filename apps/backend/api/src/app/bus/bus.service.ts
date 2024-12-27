import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { CreateStudentDto } from '../student/dto/student.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class BusService {
  constructor(private readonly dbService: DatabaseService) {}

  async createDriver(driverData: CreateDriverDto) {
    const client = await this.dbService.getPool().connect();

    try {
      await client.query('BEGIN');

      // Check if phone number is already registered
      const phoneCheck = await client.query(
        'SELECT id FROM driver WHERE mobile = $1',
        [driverData.phone]
      );

      if (phoneCheck.rows.length > 0) {
        throw new BadRequestException(
          'Phone number already registered to another driver'
        );
      }

      // Insert new driver
      const result = await client.query(
        `INSERT INTO driver (name, mobile)
         VALUES ($1, $2)
         RETURNING *`,
        [driverData.name, driverData.phone]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Driver created successfully',
        data: result.rows[0],
      };
    } catch (error) {
      await client.query('ROLLBACK');
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to create driver',
        error: error.message,
      });
    } finally {
      client.release();
    }
  }

  async findAllDrivers(institutionId: number) {
    const query = `
      SELECT DISTINCT d.* 
      FROM driver d
      INNER JOIN bus b ON d.id = b.driver_id 
      WHERE b.institution_id = $1
      ORDER BY d.id`;
    const result = await this.dbService.query(query, [institutionId]);
    return result.rows;
  }

  async findRoute(busId: string) {
    const result = await this.dbService.query(
      `
      SELECT r.* 
      FROM route r 
      WHERE r.bus_id = $1
    `,
      [busId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Route not found for this bus');
    }

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
  async createBus(institutionId: string, createBusDto: CreateBusDto) {
    try {
      // Check if driver exists
      const driverExists = await this.dbService.query(
        'SELECT id FROM driver WHERE id = $1',
        [createBusDto.driverId]
      );

      if (driverExists.rows.length === 0) {
        throw new NotFoundException('Driver not found');
      }

      const result = await this.dbService.query(
        'INSERT INTO bus (id, institution_id, driver_id, device_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [
          createBusDto.id,
          institutionId,
          createBusDto.driverId,
          createBusDto.deviceId,
        ]
      );
      return result.rows[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create bus');
    }
  }

  async getBusDetails(busId: string) {
    const result = await this.dbService.query(
      'SELECT * FROM bus WHERE id = $1',
      [busId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Bus not found');
    }

    return result.rows[0];
  }

  async findAllBuses(institutionId: string) {
    const query = `
      SELECT * FROM bus
      WHERE institution_id = $1
      ORDER BY id`;
    const result = await this.dbService.query(query, [institutionId]);
    if (result.rows.length === 0) {
      throw new NotFoundException('No buses found for this institution');
    }
    return result.rows;
  }

  async findAllBusesFromAllInstitutions() {
    const query = `
      SELECT b.id, b.device_id, i.name AS institution_name, d.name AS driver_name
      FROM bus b
      JOIN institution i ON b.institution_id = i.id
      JOIN driver d ON b.driver_id = d.id
      ORDER BY b.id
    `;
    const result = await this.dbService.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundException('No buses found');
    }

    return result.rows;
  }
}
