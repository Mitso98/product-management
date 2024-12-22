import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;
}
