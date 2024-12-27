import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentDto } from '../student/dto/student.dto';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { CreateDriverDto } from './dto/create-driver.dto';

@ApiTags('Buses')
@ApiBearerAuth()
@Controller('buses')
@UseGuards(AuthGuard('jwt'))
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post('driver/:institutionId')
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiParam({ name: 'institutionId', description: 'Institution ID' })
  @ApiResponse({
    status: 201,
    description: 'Driver has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.busService.createDriver(createDriverDto);
  }

  @Post('bus/:institutionId')
  @ApiOperation({ summary: 'Create a new bus' })
  @ApiParam({ name: 'institutionId', description: 'Institution ID' })
  @ApiResponse({
    status: 201,
    description: 'Bus has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createBus(
    @Param('institutionId') institutionId: string,
    @Body() createBusDto: CreateBusDto
  ) {
    return this.busService.createBus(institutionId, createBusDto);
  }

  @Get('bus/:busId')
  @ApiOperation({ summary: 'Get details of a specific bus' })
  @ApiParam({ name: 'busId', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the specified bus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bus not found.',
  })
  async getBusDetails(@Param('busId') busId: string) {
    return this.busService.getBusDetails(busId);
  }

  @Get('drivers/:institutionId')
  @ApiOperation({ summary: 'Get all drivers for an institution' })
  @ApiParam({ name: 'institutionId', description: 'Institution ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all drivers for the specified institution.',
  })
  getAllDrivers(@Param('institutionId') institutionId: number) {
    return this.busService.findAllDrivers(institutionId);
  }

  @Get('route/:busId')
  @ApiOperation({ summary: 'Get route for a specific bus' })
  @ApiParam({ name: 'busId', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the route for the specified bus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bus not found.',
  })
  getRoute(@Param('busId') busId: string) {
    return this.busService.findRoute(busId);
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

  @Delete('bus/:busId')
  @ApiOperation({ summary: 'Delete a bus entry' })
  @ApiResponse({
    status: 200,
    description: 'Bus has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Bus not found.' })
  async deleteBusEntry(@Param('busId') busId: string) {
    return this.busService.deleteBus(busId);
  }

  @Get('buses/:institutionId')
  @ApiOperation({ summary: 'Get all buses for an institution' })
  @ApiParam({ name: 'institutionId', description: 'Institution ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all buses for the specified institution.',
  })
  @ApiResponse({
    status: 404,
    description: 'Institution not found.',
  })
  getAllBuses(@Param('institutionId') institutionId: string) {
    return this.busService.findAllBuses(institutionId);
  }

  @Get('all-buses')
  @ApiOperation({ summary: 'Get all buses from all institutions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all buses from all institutions.',
  })
  @ApiResponse({
    status: 404,
    description: 'No buses found.',
  })
  getAllBusesFromAllInstitutions() {
    return this.busService.findAllBusesFromAllInstitutions();
  }
}
