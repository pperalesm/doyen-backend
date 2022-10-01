import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { CustomForbidden } from '../../shared/exceptions/custom-forbidden';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
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
    let collaboration = await this.collaborationsService.findOneById(id);
    if (!collaboration) {
      throw new CustomNotFound(['Collaboration not found']);
    }
    if (collaboration.userId !== authUser.id) {
      throw new CustomForbidden(['Access to resource not authorized']);
    }
    collaboration = await this.collaborationsService.accept(id);
    return new MyCollaborationDto(collaboration);
  }

  @Patch(':id/decline')
  async decline(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    let collaboration = await this.collaborationsService.findOneById(id);
    if (!collaboration) {
      throw new CustomNotFound(['Collaboration not found']);
    }
    if (collaboration.userId !== authUser.id) {
      throw new CustomForbidden(['Access to resource not authorized']);
    }
    collaboration = await this.collaborationsService.decline(id);
    return new MyCollaborationDto(collaboration);
  }
}
