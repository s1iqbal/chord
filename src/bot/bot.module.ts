import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  providers: [BotService],
})
export class BotModule {}
