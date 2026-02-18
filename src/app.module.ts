import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PoolModule } from './pool/pool.module';
import { MapModule } from './map/map.module';
import { BotModule } from './bot/bot.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PoolModule,
    MapModule,
    BotModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
