import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User> {
    return await this.userRepository.validateUser(email, password);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
