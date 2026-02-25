import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { PoolQueryDto } from './dto/pool-query.dto';

@Controller('api/pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get()
  findAll(@Query() query: PoolQueryDto) {
    return this.poolService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.poolService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePoolDto) {
    return this.poolService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePoolDto,
  ) {
    return this.poolService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.poolService.remove(id);
  }
}
