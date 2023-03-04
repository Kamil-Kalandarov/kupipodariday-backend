import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/CreateUser.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthUserresponse } from './response/authUserresponse';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalStrategy)
  @Post('signin')
  login(@Body() loginDto: LoginDto): Promise<AuthUserresponse> {
    return this.authService.validateUser(loginDto);
  }
}
