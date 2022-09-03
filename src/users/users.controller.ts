import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionContent } from '../shared/models/http-exception-content';
import { OtherUserDto } from './dto/other-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user || !user.isPublic) {
      throw new HttpException(
        new HttpExceptionContent(
          HttpStatus.NOT_FOUND,
          ['User not found'],
          'Not Found',
        ),
        HttpStatus.NOT_FOUND,
      );
    }
    return new OtherUserDto({ ...user });
  }
}
