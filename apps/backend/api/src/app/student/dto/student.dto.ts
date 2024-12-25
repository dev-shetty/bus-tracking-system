import { ApiProperty } from '@nestjs/swagger';

class ParentDto {
  @ApiProperty({ example: 'John Doe', description: 'Parent name' })
  name: string;

  @ApiProperty({ example: '555-1234', description: 'Parent phone number' })
  phone: string;
}

export class CreateStudentDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Student name' })
  name: string;

  @ApiProperty({ example: '4SF21CS146', description: 'Student USN' })
  usn: string;

  @ApiProperty({ example: 4, description: 'Student year' })
  year: number;

  @ApiProperty({ example: 40.7128, description: 'Home latitude coordinate' })
  home_latitude: number;

  @ApiProperty({ example: -74.006, description: 'Home longitude coordinate' })
  home_longitude: number;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'Home address',
  })
  home_address: string;

  @ApiProperty({
    type: [ParentDto],
    description: 'Array of parent information',
  })
  parents: ParentDto[];
}
