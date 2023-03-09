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
import { JwtGuard } from '../auth/guards/jwtGuard';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWishe.dto';
import { Wish } from './entities/wishes.entity';
import { WishesService } from './wishes.service';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() request,
  ): Promise<Wish> {
    return this.wishService.createWish(createWishDto, request.user);
  }

  @Get('last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishService.findLastWishes();
  }

  @Get('top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishService.findTopWishes();
  }

  @Get(':id')
  getWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishService.findWisheById(id);
  }

  @Patch(':id')
  updateWish(
    @Param('id') id: number,
    @Req() request,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishService.updateWish(id, request.user.id, updateWishDto);
  }

  @Delete(':id')
  deleteWish(@Param('id') id: number, @Req() request) {
    return this.wishService.deleteWish(id, request.user.id);
  }
}
