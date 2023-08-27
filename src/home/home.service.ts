import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        land_size: true,
        listed_date: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        price: true,
        property_type: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }
}
