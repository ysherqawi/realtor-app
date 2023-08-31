import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

const homeSelect = {
  id: true,
  address: true,
  city: true,
  land_size: true,
  listed_date: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
  price: true,
  property_type: true,
};

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}
interface UpateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: GetHomesParam): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        city: filters.city,
        price: filters.price,
        property_type: filters.propertyType,
      },
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      price,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        property_type: propertyType,
        price,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHome(
    id: number,
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      price,
      propertyType,
    }: UpateHomeParams,
  ): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }

    const updateHome = await this.prismaService.home.update({
      where: { id },
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        property_type: propertyType,
        price,
      },
    });

    return new HomeResponseDto(updateHome);
  }

  async deleteHome(id: number) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }

    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });

    await this.prismaService.home.delete({ where: { id } });
  }
}
