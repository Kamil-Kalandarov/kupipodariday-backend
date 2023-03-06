import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { LoginDto } from './dto/Login.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthUserresponse } from './response/authUserresponse';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    delete user.password;
    return user;
  }

  @UseGuards(LocalStrategy)
  @Post('signin')
  async login(@Body() loginDto: LoginDto): Promise<AuthUserresponse> {
    const user = await this.authService.login(loginDto);
    delete user.password;
    return user;
  }
}
