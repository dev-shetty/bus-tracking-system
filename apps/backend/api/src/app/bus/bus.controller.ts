import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BusService } from './bus.service';
import { CreateStudentDto } from '../student/dto/student.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { DatabaseService } from '../../common/services/database.service';

@ApiTags('Buses')
@ApiBearerAuth()
@Controller('buses')
@UseGuards(AuthGuard('jwt'))
export class BusController {
  constructor(
    private readonly busService: BusService,
  private readonly dbService: DatabaseService
  ) {}

  @Get('drivers')
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({
    status: 200,
    description: 'Returns all drivers.',
  })
  getAllDrivers() {
    return this.busService.findAllDrivers();
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bus routes.',
  })
  getAllRoutes() {
    return this.busService.findAllRoutes();
  }

  @Get(':busId/students')
  @ApiOperation({ summary: 'Get all students in a bus' })
  @ApiParam({ name: 'busId', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all students in the specified bus.',
  })
  getBusStudents(@Param('busId') busId: string) {
    return this.busService.findBusStudents(+busId);
  }

  @Post(':busId/students')
  @ApiOperation({ summary: 'Add new student to bus' })
  @ApiParam({ name: 'busId', description: 'Bus ID' })
  @ApiResponse({
    status: 201,
    description: 'Student has been successfully added to the bus.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  addStudentToBus(
    @Param('busId') busId: string,
    @Body() createStudentDto: CreateStudentDto
  ) {
    return this.busService.addStudent(+busId, createStudentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a bus entry' })
  @ApiResponse({
    status: 200,
    description: 'Bus has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Bus not found.' })
  async updateBusEntry(@Param('id') id: string, @Body() busData: UpdateBusDto) {
    const query = `
      UPDATE bus 
      SET bus_no = $1, institution_id = $2, driver_id = $3, device_id = $4
      WHERE id = $5
      RETURNING *`;

    const values = [
      busData.bus_no,
      busData.institution_id,
      busData.driver_id,
      busData.device_id,
      id,
    ];

    const result = await this.dbService.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundException('Bus not found');
    }
    return result.rows[0];
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bus entry' })
  @ApiResponse({
    status: 200,
    description: 'Bus has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Bus not found.' })
  async deleteBusEntry(@Param('id') id: string) {
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
