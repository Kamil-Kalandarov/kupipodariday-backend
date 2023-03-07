import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from 'src/wishes/wishes.service';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { userRequestType } from '../utils/userRequestType';
import { FindUserDto } from './dto/findUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly wisheService: WishesService,
  ) {}

  @Get('me')
  async getOwnUser(@Req() request: userRequestType): Promise<User> {
    const user = await this.userService.findUserByUserName(
      request.user.username,
    );
    delete user.password;
    return user;
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string): Promise<User> {
    const user = await this.userService.findUserByUserName(username);
    delete user.password;
    return user;
  }

  /* @Get('me/wishes')
  async getOwnWishes(@Req() request) {
    const user = await this.userService.findUserByUserName(
      request.user.username,
    );
    return this.wisheService.getWishes(user.id);
  } */

  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: userRequestType,
  ): Promise<UpdateUserDto> {
    const userId = request.user.id;
    await this.userService.updateUser(userId, updateUserDto);
    delete updateUserDto.password;
    return updateUserDto;
  }

  /* @Get(':username/wishes')
  async getSomeUserWishes(@Param('username') username: string) {
    const user = await this.userService.findUserByUserName(username);
    console.log(user);
    return this.wisheService.getWishes(user.id);
  } */

  @Post('find')
  findByNamerOrEmail(@Body() findUserDto: FindUserDto): Promise<User> {
    return this.userService.findMany(findUserDto.query);
  }
}
