import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dtos/home.dto';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get('/:id')
  async getHome(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HomeResponseDto> {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  async createHome(
    @Body() body: CreateHomeDto,
    @User() user: UserInfo,
  ): Promise<HomeResponseDto> {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Put('/:id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ): Promise<HomeResponseDto> {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHome(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete('/:id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Body() { message }: InquireDto,
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
  ) {
    return this.homeService.inquire(homeId, user, message);
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.getMessagesByHome(id);
  }
}
