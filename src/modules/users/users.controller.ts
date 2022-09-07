import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionContent } from '../../shared/models/http-exception-content';
import { OtherUserDto } from './dto/other-user.dto';
import { FindAllDto } from './dto/find-all.dto';

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

  @Get()
  async findAll(@Query() findAllDto: FindAllDto) {
    const users = await this.usersService.findAll(findAllDto);
    return users.map((user) => new OtherUserDto({ ...user }));
  }
}
