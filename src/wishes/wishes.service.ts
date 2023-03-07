import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWishe.dto';
import { Wish } from './entities/wishes.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepositiry: Repository<Wish>,
  ) {}

  /* async getWishes(userId: number) {
    const userWishes = await this.wishRepositiry.find({
      where: { owner: userId },
      relations: {
        owner: true,
        offers: true,
      },
    });
    return userWishes;
  } */

  async createWish(createWishDto: CreateWishDto) {
    const newWish = await this.wishRepositiry.create(createWishDto);
    return this.wishRepositiry.save(newWish);
  }

  async findLastWishes() {
    const wishes = await this.wishRepositiry.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: { id: 'DESC' },
      take: 15,
    });
    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.wishRepositiry.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: { id: 'DESC' },
      take: 15,
    });
    return wishes;
  }

  async findWisheById(id: number) {
    const wish = await this.wishRepositiry.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    return wish;
  }

  async updateWish(userId: number, id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepositiry.update({ id }, updateWishDto);
  }
}
