import { Body, Controller, Get, Post } from '@nestjs/common';
import { Active } from '../../shared/decorators/active.decorator';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async findAll() {
    return;
  }

  @Active()
  @Post()
  async create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createPurchaseDto: CreatePurchaseDto,
  ) {
    return await this.purchasesService.createOne(authUser, createPurchaseDto);
  }
}
