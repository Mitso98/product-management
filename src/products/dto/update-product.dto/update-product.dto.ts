import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsNumber } from 'class-validator';
import { CreateProductDto } from '../create-product.dto/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'The name of the product',
    example: 'iPhone 13',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone model with A15 chip',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
