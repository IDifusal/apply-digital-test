import 'reflect-metadata';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumberString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListProductsQueryDto {
  @ApiPropertyOptional({ default: 1, type: Number })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value ?? '1', 10))
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumberString()
  priceMin?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumberString()
  priceMax?: string;
}
