import { Book } from 'src/books/entity/book.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/auth/entitiy/refresh-token.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user, {
    eager: true,
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Book, (book) => book.user, { eager: true })
  books: Book[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
