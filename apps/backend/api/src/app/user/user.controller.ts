import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.GOVERNMENT)
  @ApiOperation({ summary: 'Create new user (Government only)' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'Access denied - Insufficient permissions.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('institutions')
  @Roles(Role.GOVERNMENT)
  @ApiOperation({ summary: 'Get all institutions (Government only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all institutions.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'City School' },
          contact: { type: 'string', example: '123-456-7890' },
          latitude: { type: 'number', example: 40.7128 },
          longitude: { type: 'number', example: -74.006 },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'Access denied - Insufficient permissions.',
  })
  async getAllInstitutions() {
    return this.userService.findAllInstitutions();
  }

  @Get('buses/locations')
  @Roles(Role.GOVERNMENT)
  @ApiOperation({ summary: 'Get all bus locations (Government only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all bus locations.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bus_id: { type: 'number', example: 1 },
          bus_no: { type: 'string', example: 'BUS-001' },
          institution_name: { type: 'string', example: 'City School' },
          latitude: { type: 'number', example: 40.7128 },
          longitude: { type: 'number', example: -74.006 },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getAllBusLocations() {
    return this.userService.findAllBusLocations();
  }

  @Get('institution/buses')
  @Roles(Role.INSTITUTION)
  @ApiOperation({ summary: 'Get institution buses (Institution only)' })
  @ApiResponse({
    status: 200,
    description: 'List of buses for the institution.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          bus_no: { type: 'string', example: 'BUS-001' },
          driver_name: { type: 'string', example: 'John Smith' },
          latitude: { type: 'number', example: 40.7128 },
          longitude: { type: 'number', example: -74.006 },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getInstitutionBuses(@Req() req) {
    if (!req.user.institution_id) {
      throw new UnauthorizedException(
        'User is not associated with any institution'
      );
    }
    return this.userService.findInstitutionBuses(req.user.institution_id);
  }
}
