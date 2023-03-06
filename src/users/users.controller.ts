import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  getOwnUser(@Req() request) {
    console.log(request.user);
    return request.user;
  }

  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request,
  ): Promise<UpdateUserDto> {
    const userId = request.user.id;
    await this.userService.updateUser(userId, updateUserDto);
    delete updateUserDto.password;
    return updateUserDto;
  }

  /* @Get('me/wishes')
  async getOwnWishes(@Req() request) {
    
  } */
}
