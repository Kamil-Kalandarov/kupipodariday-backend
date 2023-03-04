import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Offer } from '../../offers/entities/offers.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column()
  @IsNotEmpty()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column('numeric', { scale: 2 })
  @IsNotEmpty()
  price: number;

  @Column()
  @IsNotEmpty()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @IsNotEmpty()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}