import { User } from './../users/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from 'src/books/entity/book.entity';
import { RefreshToken } from 'src/auth/entitiy/refresh-token.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'book_api',
  entities: [Book, User, RefreshToken],
  synchronize: true,
};
