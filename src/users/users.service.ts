import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { User } from './entities/users.entity';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FindUserDto } from './dto/findUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findUserByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    delete user.email;
    return user;
  }

  async findMany(query: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: query }, { username: query }],
    });
    return user;
  }

  async IsUserExist(email: string, userName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: email }, { username: userName }],
    });
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.IsUserExist(
      createUserDto.email,
      createUserDto.username,
    );
    if (existUser) {
      throw new ConflictException(
        'Пользователь с таким именем или адресом электронной почты уже существует',
      );
    } else {
      createUserDto.password = await this.hashService.hashPassord(
        createUserDto.password,
      );
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    }
  }

  async updateUser(id: number, updateUderDto: UpdateUserDto) {
    if (updateUderDto.password) {
      updateUderDto.password = await this.hashService.hashPassord(
        updateUderDto.password,
      );
    }
    return await this.userRepository.update({ id }, updateUderDto);
  }

  /* async getWishes(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    delete user.password;
    return user.wishes;
  } */

  /* async findOne(query: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(query);
    return user;
  } */
}
