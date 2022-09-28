import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { PagingDto } from '../../shared/util/paging.dto';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CollaborationsService } from './collaborations.service';
import { MyCollaborationDto } from './dto/my-collaboration.dto';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collaborationsService: CollaborationsService) {}

  @Get('mine')
  async mine(@AuthUser() authUser: AuthUserDto, @Query() pagingDto: PagingDto) {
    const collaborations = await this.collaborationsService.mine(
      authUser,
      pagingDto,
    );
    return collaborations.map(
      (collaboration) => new MyCollaborationDto(collaboration),
    );
  }

  @Patch(':id/accept')
  async accept(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    const collaboration = await this.collaborationsService.accept(authUser, id);
    return new MyCollaborationDto(collaboration);
  }

  @Patch(':id/decline')
  async decline(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    const collaboration = await this.collaborationsService.decline(
      authUser,
      id,
    );
    return new MyCollaborationDto(collaboration);
  }
}
