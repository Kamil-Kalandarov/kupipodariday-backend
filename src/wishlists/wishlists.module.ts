import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishList.entity';
import { WishlistController } from './wishlists.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistsModule {}
