import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePoolDto {
  @IsOptional()
  @IsNumber()
  version?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  averageMMR?: number;
}
