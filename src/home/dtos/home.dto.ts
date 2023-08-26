import { PropertyType } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;
  city: string;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  price: number;

  @Exclude()
  property_type: PropertyType;

  @Expose({ name: 'PropertyType' })
  PropertyType() {
    return this.property_type;
  }

  @Exclude()
  realtor_id: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
