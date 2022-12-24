import { User } from './../users/entities/user.entity';
import { BookRepository } from './repository/book.repository';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { max, min } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';

@Injectable()
export class BooksService {
  constructor(private bookRepository: BookRepository) {}

  async getBooks(user: User, filter: FilterBookDto): Promise<Book[]> {
    return await this.bookRepository.getBooks(user, filter);
  }

  async createBook(user: User, createBookDto: CreateBookDto): Promise<void> {
    return await this.bookRepository.createBook(user, createBookDto);
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException(`book with ${id} is not found`);
    }

    return book;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<void> {
    const book = await this.getBookById(id);
    return await this.bookRepository.updateBook(book, updateBookDto);
  }

  async deleteBook(id: string): Promise<void> {
    const book = await this.getBookById(id);
    return await this.bookRepository.deleteBook(book);
  }
  // private readonly books: any[] = [];
  // getBooks(filter: FilterBookDto): any[] {
  //   const { title, author, category, min_year, max_year } = filter;
  //   const books = this.books.filter((book) => {
  //     if (title && book.title != title) {
  //       return false;
  //     }
  //     if (author && book.author != author) {
  //       return false;
  //     }
  //     if (category && book.category != category) {
  //       return false;
  //     }
  //     if (min_year && book.year < min_year) {
  //       return false;
  //     }
  //     if (max_year && book.year > max_year) {
  //       return false;
  //     }
  //     return true;
  //   });
  //   return books;
  // }
  // getBookById(id: string) {
  //   const book = this.findBookById(id);
  //   if (book === -1) {
  //     throw new NotFoundException(`Book with id ${id} is not found`);
  //   }
  //   return book;
  // }
  // createBook(createBookDto: CreateBookDto) {
  //   const { title, author, category, year } = createBookDto;
  //   this.books.push({
  //     id: uuidv4(),
  //     title,
  //     author,
  //     category,
  //     year,
  //   });
  // }
  // findBookById(id: string) {
  //   const bookid = this.books.findIndex((book) => (book.id = id));
  //   if (bookid === -1) {
  //     throw new NotFoundException(`Book with id ${id} is not found`);
  //   }
  //   return bookid;
  // }
  // updateBook(id: string, updateBookDto: UpdateBookDto) {
  //   const { title, author, category } = updateBookDto;
  //   const bookid = this.findBookById(id);
  //   this.books[bookid].title = title;
  //   this.books[bookid].author = author;
  //   this.books[bookid].category = category;
  // }
  // deleteBook(id: string) {
  //   const bookid = this.findBookById(id);
  //   this.books.splice(bookid, 1);
  // }
}
