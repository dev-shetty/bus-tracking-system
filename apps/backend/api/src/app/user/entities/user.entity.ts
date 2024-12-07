import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Column()
  name: string;

  @ApiProperty({
    enum: Role,
    example: Role.INSTITUTION,
    description: 'User role',
  })
  @Column()
  role: Role;

  @ApiProperty({
    example: 1,
    description: 'Institution ID (required for institution users)',
    required: false,
  })
  @Column({ nullable: true })
  institution_id: number;
}
