import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { OtherUserDto } from './dto/other-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user || !user.isPublic) {
      throw new CustomNotFound(['User not found']);
    }
    return new OtherUserDto(user);
  }

  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    const users = await this.usersService.findAll(findAllUsersDto);
    return users.map((user) => new OtherUserDto(user));
  }
}
