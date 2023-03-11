import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  create(@Body() createWishDto: CreateWishDto, @Req() request): Promise<Wish> {
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
  async updateWish(
    @Param('id') id: number,
    @Req() request,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.wishService.findWisheById(id);
    if (request.user.id !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }
    if (wish.raised !== 0 && updateWishDto.price) {
      throw new ForbiddenException(
        'Изменить стоимость невозможно, так как уже есть желащие внести деньги',
      );
    }
    return this.wishService.updateWish(id, updateWishDto);
  }

  @Delete(':id')
  deleteWish(@Param('id') id: number, @Req() request) {
    return this.wishService.deleteWish(id, request.user.id);
  }

  @Post(':id/copy')
  addToOwnWishList(@Param('id') id: number, @Req() request): Promise<Wish> {
    return this.wishService.addToOwnWishList(id, request.user);
  }
}
