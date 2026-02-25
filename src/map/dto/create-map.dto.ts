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

export class CreateMapDto {
  @IsNumber()
  mapId: number;

  @IsString()
  @IsIn(VALID_MODS)
  mod: string;

  @IsString()
  mapName: string;

  @IsString()
  difficultyName: string;

  @IsNumber()
  @Min(0)
  length: number;

  @IsNumber()
  starRating: number;

  @IsNumber()
  mapSetId: number;

  @IsNumber()
  @Min(0)
  maxCombo: number;

  @IsNumber()
  @Min(0)
  bpm: number;

  @IsOptional()
  @IsBoolean()
  downloadAvailable?: boolean = true;

  @IsNumber()
  mmr: number;

  @IsOptional()
  @IsString()
  skillset?: string = 'NOT_DEFINED';

  @IsString()
  sheetId: string;

  @IsString()
  poolName: string;
}
