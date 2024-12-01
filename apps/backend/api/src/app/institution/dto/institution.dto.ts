import { ApiProperty } from '@nestjs/swagger';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'City School', description: 'Name of the institution' })
  name: string;

  @ApiProperty({ example: '123-456-7890', description: 'Contact number' })
  contact: string;

  @ApiProperty({ example: 40.7128, description: 'Latitude coordinate' })
  latitude: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate' })
  longitude: number;
}

export class UpdateInstitutionDto extends CreateInstitutionDto {} 