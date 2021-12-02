import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'toyota',
    description: 'make',
  })
  @IsString()
  make: string;

  @ApiProperty({
    example: 'corolla',
    description: 'model of the car',
  })
  @IsString()
  model: string;

  @ApiProperty({
    example: 2012,
    description: 'year of the car',
  })
  @IsNumber()
  @Min(1940)
  @Max(2050)
  year: number;

  @ApiProperty({
    example: 340000,
    description: 'miles of the car',
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ApiProperty({
    example: 0,
    description: 'longitude',
  })
  @IsLongitude()
  lng: number;

  @ApiProperty({
    example: 0,
    description: 'latitude',
  })
  @IsLatitude()
  lat: number;

  @ApiProperty({
    example: 20000,
    description: 'price',
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
