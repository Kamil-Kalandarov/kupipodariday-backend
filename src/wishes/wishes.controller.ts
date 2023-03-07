import {
  Body,
  Controller,
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
import { WishesService } from './wishes.service';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishService.createWish(createWishDto);
  }

  @Get('last')
  getLastWishes() {
    return this.wishService.findLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishService.findTopWishes();
  }

  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishService.findWisheById(id);
  }

  @Patch(':id')
  updateWish(
    @Param('id') id: number,
    @Req() request,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishService.updateWish(id, request.user.id, updateWishDto);
  }
}
