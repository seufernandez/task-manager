import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterUserDto,
    description: 'User credentials for registration'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid data provided or username already exists' 
  })
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    await this.usersService.create(username, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - JWT token missing or invalid' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async getUserProfile(@Request() req): Promise<Omit<User, 'password'>> {
    const userId = req.user.sub;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}