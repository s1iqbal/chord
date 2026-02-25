import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';

@Controller()
export class MapCrudController {
  constructor(private readonly mapService: MapService) {}

  @Post('api/pools/:poolId/maps')
  addMapToPool(
    @Param('poolId', ParseIntPipe) poolId: number,
    @Body() dto: CreateMapDto,
  ) {
    return this.mapService.createForPool(poolId, dto);
  }

  @Patch('api/maps/:id')
  updateMap(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMapDto,
  ) {
    return this.mapService.updateMap(id, dto);
  }

  @Delete('api/maps/:id')
  removeMap(@Param('id', ParseIntPipe) id: number) {
    return this.mapService.removeMap(id);
  }
}
