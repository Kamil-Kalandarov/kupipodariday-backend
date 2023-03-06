import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { User } from './entities/users.entity';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findUser(email: string, userName: string) {
    return this.userRepository.findOne({
      where: [{ email: email }, { username: userName }],
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.findUser(
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

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async updateUser(id: number, updateUderDto: UpdateUserDto) {
    if (updateUderDto.password) {
      updateUderDto.password = await this.hashService.hashPassord(
        updateUderDto.password,
      );
    }
    return await this.userRepository.update({ id }, updateUderDto);
  }

  /* async getOwnWished(id: number) */

  /* async findOne(query: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(query);
    return user;
  } */
}
