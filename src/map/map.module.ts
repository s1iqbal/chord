import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { PoolModule } from '../pool/pool.module';

@Module({
  imports: [PoolModule],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
