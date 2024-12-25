import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../common/services/database.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dbService: DatabaseService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // If role is institution, verify institution exists
    if (
      createUserDto.role === Role.INSTITUTION &&
      createUserDto.institution_id
    ) {
      const institutionExists = await this.dbService.query(
        'SELECT id FROM institution WHERE id = $1',
        [createUserDto.institution_id]
      );

      if (!institutionExists.rows.length) {
        throw new BadRequestException('Institution not found');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove password from response
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'institution_id'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'institution_id'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAllInstitutions() {
    const result = await this.dbService.query(`
      SELECT i.id, i.name, i.contact, i.latitude, i.longitude,
             COUNT(DISTINCT b.id) as total_buses,
             COUNT(DISTINCT s.id) as total_students
      FROM institution i
      LEFT JOIN bus b ON i.id = b.institution_id
      LEFT JOIN student s ON i.id = s.institution_id
      GROUP BY i.id, i.name, i.contact, i.latitude, i.longitude
    `);
    return result.rows;
  }

  async findAllBusLocations() {
    const result = await this.dbService.query(`
      SELECT 
        b.id as bus_id,
        b.bus_no,
        i.name as institution_name,
        bl.latitude,
        bl.longitude,
        bl.timestamp,
        d.name as driver_name
      FROM bus b
      JOIN institution i ON b.institution_id = i.id
      JOIN driver d ON b.driver_id = d.id
      LEFT JOIN bus_location bl ON b.id = bl.bus_id
      WHERE bl.id IN (
        SELECT MAX(id) 
        FROM bus_location 
        GROUP BY bus_id
      )
    `);
    return result.rows;
  }

  async findInstitutionBuses(institutionId: number) {
    const result = await this.dbService.query(
      `
      SELECT 
        b.id,
        b.bus_no,
        d.name as driver_name,
        bl.latitude,
        bl.longitude,
        bl.timestamp,
        COUNT(s.id) as student_count
      FROM bus b
      JOIN driver d ON b.driver_id = d.id
      LEFT JOIN bus_location bl ON b.id = bl.bus_id
      LEFT JOIN student s ON b.id = s.bus_id
      WHERE b.institution_id = $1
      AND bl.id IN (
        SELECT MAX(id) 
        FROM bus_location 
        GROUP BY bus_id
      )
      GROUP BY b.id, b.bus_no, d.name, bl.latitude, bl.longitude, bl.timestamp
    `,
      [institutionId]
    );
    return result.rows;
  }

  async findInstitutionStudents(institutionId: number) {
    const result = await this.dbService.query(
      `
      SELECT 
        s.*,
        b.bus_no,
        array_agg(
          json_build_object(
            'name', p.name,
            'phone', p.phone,
            'email', p.email
          )
        ) as parents
      FROM student s
      JOIN bus b ON s.bus_id = b.id
      LEFT JOIN parent_student ps ON s.usn = ps.student_usn
      LEFT JOIN parent p ON ps.phone = p.phone
      WHERE s.institution_id = $1
      GROUP BY s.id, b.bus_no
    `,
      [institutionId]
    );
    return result.rows;
  }
}
