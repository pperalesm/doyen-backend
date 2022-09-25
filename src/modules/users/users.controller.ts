import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { OtherUserDto } from './dto/other-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { MyUserDto } from './dto/my-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    const users = await this.usersService.findAll(findAllUsersDto);
    return users.map((user) => new OtherUserDto(user));
  }

  @Get('me')
  async me(@AuthUser() authUser: AuthUserDto) {
    const user = await this.usersService.me(authUser);
    return new MyUserDto(user);
  }

  @Get('followers')
  async followers(@AuthUser() authUser: AuthUserDto) {
    const users = await this.usersService.followers(authUser);
    return users.map((user) => new OtherUserDto(user));
  }

  @Get('followed')
  async followed(@AuthUser() authUser: AuthUserDto) {
    const users = await this.usersService.followed(authUser);
    return users.map((user) => new OtherUserDto(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return new OtherUserDto(user);
  }

  @Patch()
  async updateMe(
    @AuthUser() authUser: AuthUserDto,
    @Body() updateMeDto: UpdateMeDto,
  ) {
    const user = await this.usersService.updateMe(authUser, updateMeDto);
    return new MyUserDto(user);
  }

  @Patch(':id/follow')
  async follow(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    await this.usersService.follow(authUser, id);
  }

  @Patch(':id/unfollow')
  async unfollow(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    await this.usersService.unfollow(authUser, id);
  }
}
