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

  @Get('students/:busId')
  @ApiOperation({ summary: 'Get all students in a bus' })
  @ApiParam({ name: 'busId', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all students in the specified bus.',
  })
  getBusStudents(@Param('busId') busId: string) {
    return this.busService.findBusStudents(busId);
  }

  @Post('student/:busId')
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
    return this.busService.addStudent(busId, createStudentDto);
  }

  @Delete('student/:usn')
  @ApiOperation({ summary: 'Delete a student from bus' })
  @ApiParam({ name: 'usn', description: 'Student USN' })
  @ApiResponse({
    status: 200,
    description: 'Student has been successfully deleted from the bus.',
  })
  removeStudent(@Param('usn') usn: string) {
    return this.busService.removeStudent(usn);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bus entry' })
  @ApiResponse({
    status: 200,
    description: 'Bus has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Bus not found.' })
  async deleteBusEntry(@Param('id') id: string) {
    return this.busService.deleteBus(id);
  }
}
