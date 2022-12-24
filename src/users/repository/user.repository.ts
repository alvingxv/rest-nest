import { CreateUserDto } from './../dto/create-user.dto';
import { User } from './../entities/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(payload: CreateUserDto): Promise<void> {
    const { name, email, password } = payload;
    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      console.log(e);
      if (e.code == 'ER_DUP_ENTRY') {
        throw new ConflictException(`email ${email} has been used`);
      }
      throw new InternalServerErrorException(e);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findOne({ where: { email: email } });

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
