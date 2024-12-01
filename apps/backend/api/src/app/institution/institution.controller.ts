import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DatabaseService } from '../../common/services/database.service';
import {
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from './dto/institution.dto';

@Controller('institution')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Institution')
@ApiBearerAuth()
export class InstitutionController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create new institution' })
  @ApiResponse({
    status: 201,
    description: 'Institution has been successfully created.',
  })
  async createInstitution(@Body() institutionData: CreateInstitutionDto) {
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

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({ status: 200, description: 'Returns all institutions.' })
  async getAllInstitutions() {
    const query = 'SELECT * FROM institution';
    const result = await this.dbService.query(query);
    return result.rows;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an institution' })
  @ApiResponse({
    status: 200,
    description: 'Institution has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  async updateInstitution(
    @Param('id') id: string,
    @Body() institutionData: UpdateInstitutionDto
  ) {
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an institution' })
  @ApiResponse({
    status: 200,
    description: 'Institution has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  async deleteInstitution(@Param('id') id: string) {
    // First check if institution has any associated buses
    const checkBusesQuery = `
      SELECT COUNT(*) FROM bus WHERE institution_id = $1
    `;
    const busesResult = await this.dbService.query(checkBusesQuery, [id]);
    if (busesResult.rows[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete institution with associated buses'
      );
    }

    // Then check if institution has any students
    const checkStudentsQuery = `
      SELECT COUNT(*) FROM student WHERE institution_id = $1
    `;
    const studentsResult = await this.dbService.query(checkStudentsQuery, [id]);
    if (studentsResult.rows[0].count > 0) {
      throw new BadRequestException(
        'Cannot delete institution with associated students'
      );
    }

    const deleteQuery = `
      DELETE FROM institution WHERE id = $1
      RETURNING *`;

    const result = await this.dbService.query(deleteQuery, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Institution not found');
    }
    return { message: 'Institution deleted successfully' };
  }
}
