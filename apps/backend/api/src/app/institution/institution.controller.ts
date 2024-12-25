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
  ApiParam,
} from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import {
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from './dto/institution.dto';

@Controller('institutions')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Institutions')
@ApiBearerAuth()
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new institution' })
  @ApiResponse({
    status: 201,
    description: 'Institution successfully created.',
    type: CreateInstitutionDto,
  })
  async createInstitution(@Body() institutionData: CreateInstitutionDto) {
    return this.institutionService.create(institutionData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({
    status: 200,
    description: 'List of all institutions',
    type: [CreateInstitutionDto],
  })
  async getAllInstitutions() {
    return this.institutionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an institution by id' })
  @ApiParam({ name: 'id', description: 'Institution ID' })
  @ApiResponse({
    status: 200,
    description: 'The found institution',
    type: CreateInstitutionDto,
  })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async getInstitution(@Param('id') id: string) {
    return this.institutionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an institution' })
  @ApiParam({ name: 'id', description: 'Institution ID' })
  @ApiResponse({
    status: 200,
    description: 'Institution successfully updated',
    type: UpdateInstitutionDto,
  })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async updateInstitution(
    @Param('id') id: string,
    @Body() institutionData: UpdateInstitutionDto
  ) {
    return this.institutionService.update(id, institutionData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an institution' })
  @ApiParam({ name: 'id', description: 'Institution ID' })
  @ApiResponse({ status: 200, description: 'Institution successfully deleted' })
  @ApiResponse({ status: 404, description: 'Institution not found' })
  async deleteInstitution(@Param('id') id: string) {
    return this.institutionService.remove(id);
  }
}
