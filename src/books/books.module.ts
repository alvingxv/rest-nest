import { Book } from './entity/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookRepository } from './repository/book.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, BookRepository],
})
export class BooksModule {}
