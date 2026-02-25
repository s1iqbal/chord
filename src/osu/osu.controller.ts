import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OsuService } from './osu.service';

@Controller('api/osu')
export class OsuController {
  constructor(private readonly osuService: OsuService) {}

  @Get('beatmap/:beatmapId')
  getBeatmap(@Param('beatmapId', ParseIntPipe) beatmapId: number) {
    return this.osuService.getBeatmap(beatmapId);
  }
}
