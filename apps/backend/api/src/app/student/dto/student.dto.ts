import { ApiProperty } from '@nestjs/swagger';

class ParentDto {
  @ApiProperty({ example: 'John Doe', description: 'Parent name' })
  name: string;

  @ApiProperty({ example: '555-1234', description: 'Parent phone number' })
  phone: string;

  @ApiProperty({ example: 'john@example.com', description: 'Parent email' })
  email: string;
}

export class CreateStudentDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Student name' })
  name: string;

  @ApiProperty({ example: 40.7128, description: 'Home latitude coordinate' })
  home_latitude: number;

  @ApiProperty({ example: -74.0060, description: 'Home longitude coordinate' })
  home_longitude: number;

  @ApiProperty({ example: 1, description: 'Bus ID' })
  bus_id: number;

  @ApiProperty({ example: 1, description: 'Institution ID' })
  institution_id: number;

  @ApiProperty({ 
    type: [ParentDto], 
    description: 'Array of parent information'
  })
  parents: ParentDto[];
} 