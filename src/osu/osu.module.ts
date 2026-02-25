import { Module } from '@nestjs/common';
import { OsuService } from './osu.service';
import { OsuController } from './osu.controller';

@Module({
  controllers: [OsuController],
  providers: [OsuService],
  exports: [OsuService],
})
export class OsuModule {}
