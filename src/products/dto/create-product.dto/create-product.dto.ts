import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 13' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest iPhone model' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 999.99 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  stock: number;
}
