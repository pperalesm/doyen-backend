import { Controller, Get, Query } from '@nestjs/common';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { PagingDto } from '../../shared/util/paging.dto';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CollaborationsService } from './collaborations.service';
import { MyCollaborationDto } from './dto/my-collaboration.dto';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collaborationsService: CollaborationsService) {}

  @Get()
  async findAll(
    @AuthUser() authUser: AuthUserDto,
    @Query() pagingDto: PagingDto,
  ) {
    const collaborations = await this.collaborationsService.findAll(
      authUser,
      pagingDto,
    );
    return collaborations.map(
      (collaboration) => new MyCollaborationDto(collaboration),
    );
  }
}
