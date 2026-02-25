import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';

const VALID_MODS = [
  'NOMOD',
  'FREEMOD',
  'HIDDEN',
  'HARDROCK',
  'DOUBLETIME',
  'TIEBREAKER',
];

export class UpdateMapDto {
  @IsOptional()
  @IsNumber()
  mapId?: number;

  @IsOptional()
  @IsString()
  @IsIn(VALID_MODS)
  mod?: string;

  @IsOptional()
  @IsString()
  mapName?: string;

  @IsOptional()
  @IsString()
  difficultyName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @IsOptional()
  @IsNumber()
  starRating?: number;

  @IsOptional()
  @IsNumber()
  mapSetId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxCombo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bpm?: number;

  @IsOptional()
  @IsBoolean()
  downloadAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  mmr?: number;

  @IsOptional()
  @IsString()
  skillset?: string;

  @IsOptional()
  @IsString()
  sheetId?: string;

  @IsOptional()
  @IsString()
  poolName?: string;
}
