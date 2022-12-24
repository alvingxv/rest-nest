import { JwtGuard } from './../guard/jwt.guard';
import { User } from './../users/entities/user.entity';
import { UUIDValidationPipe } from './pipes/uuid-validation.pipe';
import { Book } from './entity/book.entity';
import { FilterBookDto } from './dto/filter-book.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthGuard } from '@nestjs/passport/dist';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  async getBooks(
    @Query() filter: FilterBookDto,
    @GetUser() user: User,
  ): Promise<Book[]> {
    console.log(user);
    return await this.booksService.getBooks(user, filter);
  }

  @Get('/:id')
  async getBookById(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post()
  async postBook(
    @GetUser() user: User,
    @Body() payload: CreateBookDto,
  ): Promise<void> {
    return await this.booksService.createBook(user, payload);
  }

  @Put('/:id')
  async updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return await this.booksService.updateBook(id, payload);
  }

  @Delete('/:id')
  deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}
