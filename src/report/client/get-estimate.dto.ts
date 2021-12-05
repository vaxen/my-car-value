import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
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

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    example: 2012,
    description: 'year of the car',
  })
  @IsNumber()
  @Min(1940)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    example: 340000,
    description: 'miles of the car',
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    example: 0,
    description: 'longitude',
  })
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    example: 0,
    description: 'latitude',
  })
  @IsLatitude()
  lat: number;
}
