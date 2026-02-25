import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePoolDto {
  @IsNumber()
  version: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsNumber()
  @Min(0)
  averageMMR: number;
}
