import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dtos/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes();
  }

  @Get('/:id')
  getHome() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  @Put('/:id')
  updateHome() {
    return {};
  }

  @Delete('/:id')
  deleteHome() {}
}
