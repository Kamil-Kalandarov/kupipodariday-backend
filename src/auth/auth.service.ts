import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { CreateUserDto } from '../users/dto/CreateUser.dto';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/Login.dto';
import { AuthUserresponse } from './response/authUserresponse';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hasService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  /* auth(user: User) {
    return this.
  } */

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  async validateUser(loginDto: LoginDto): Promise<AuthUserresponse> {
    const existUser = await this.userService.findUserByEmail(loginDto.email);
    if (!existUser) {
      throw new UnauthorizedException('Неправильные почта или пароль');
    }
    const isPasswordValide = await this.hasService.validatePassword(
      loginDto.password,
      existUser.password,
    );
    if (!isPasswordValide) {
      throw new UnauthorizedException('Неправильные почта или пароль');
    }
    const token = await this.tokenService.generateToken(loginDto.email);
    return { ...existUser, token };
  }

  /* async login(user: User) {
    
  } */
}
