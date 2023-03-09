import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
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

  async getWishes(userId: number) {
    const userWishes = await this.wishRepositiry.find({
      where: { owner: { id: userId } },
      relations: {
        owner: true,
        offers: true,
      },
    });
    return userWishes;
  }

  async IsWishNameExist(name: string): Promise<Wish> {
    const wish = await this.wishRepositiry.findOne({
      where: { name: name },
    });
    return wish;
  }

  async createWish(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const oldWishName = await this.IsWishNameExist(createWishDto.name);
    if (oldWishName) {
      throw new ConflictException('Подарок с таким названием уже есть');
    }
    const newWish = await this.wishRepositiry.create({
      ...createWishDto,
      owner,
    });
    return this.wishRepositiry.save(newWish);
  }

  async findLastWishes(): Promise<Wish[]> {
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

  async findTopWishes(): Promise<Wish[]> {
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

  async findWisheById(id: number): Promise<Wish> {
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

  async updateWish(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findWisheById(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }
    return this.wishRepositiry.save({ ...wish, ...updateWishDto });
  }

  async deleteWish(id: number, userId: number) {
    const wish = await this.findWisheById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужой подарок');
    }
    return this.wishRepositiry.delete(id);
  }
}
