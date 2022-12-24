import { User } from './../../users/entities/user.entity';
import { UpdateBookDto } from './../dto/update-book.dto';
import { CreateBookDto } from './../dto/create-book.dto';
import { FilterBookDto } from './../dto/filter-book.dto';
import { Book } from './../entity/book.entity';
import { Repository, DataSource } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async getBooks(user: User, filter: FilterBookDto): Promise<Book[]> {
    const { title, author, category, min_year, max_year } = filter;

    const query = this.createQueryBuilder('book').where(
      'book.userId = :userId',
      { userId: user.id },
    );

    if (title) {
      query.andWhere('lower(book.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }

    if (author) {
      query.andWhere('lower(book.author) LIKE :author', {
        author: `%${author.toLowerCase()}`,
      });
    }

    if (category) {
      query.andWhere('lower(book.category) LIKE :category', {
        category: `%${category.toLowerCase()}`,
      });
    }

    if (min_year) {
      query.andWhere('book.year >= :min_year', { min_year });
    }

    if (max_year) {
      query.andWhere('book.year <= :max_year', { max_year });
    }

    return await query.getMany();
  }

  async createBook(user: User, payload: CreateBookDto): Promise<void> {
    const { title, author, category, year } = payload;
    const book = this.create();
    book.title = title;
    book.author = author;
    book.category = category;
    book.year = year;
    book.user = user;

    try {
      await book.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateBook(book: Book, payload: UpdateBookDto): Promise<void> {
    const { title, author, category, year } = payload;
    book.title = title;
    book.author = author;
    book.category = category;
    book.year = year;
    try {
      await book.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteBook(book: Book): Promise<void> {
    try {
      await book.remove();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
