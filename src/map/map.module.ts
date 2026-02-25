import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { MapCrudController } from './map-crud.controller';
import { PoolModule } from '../pool/pool.module';

@Module({
  imports: [PoolModule],
  controllers: [MapController, MapCrudController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
