import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PoolService } from '../pool/pool.service';
import { Map as MapModel, Prisma } from '@prisma/client';

export interface MapFilters {
  mod?: string;
  starRating?: number;
  bpm?: number;
}

const VALID_MODS = [
  'NOMOD',
  'FREEMOD',
  'HIDDEN',
  'HARDROCK',
  'DOUBLETIME',
  'TIEBREAKER',
];

@Injectable()
export class MapService {
  constructor(
    private prisma: PrismaService,
    private poolService: PoolService,
  ) {}

  parseFilters(filterString: string): MapFilters {
    const filters: MapFilters = {};
    const parts = filterString.split(' ');

    for (const part of parts) {
      const lower = part.toLowerCase();

      if (lower.startsWith('mod=')) {
        const modValue = part.substring(4).toUpperCase();
        if (VALID_MODS.includes(modValue)) {
          filters.mod = modValue;
        }
      }

      if (lower.startsWith('stars=')) {
        const stars = parseFloat(part.split('=')[1]);
        if (stars > 0 && stars < 10) {
          filters.starRating = parseFloat(stars.toFixed(2));
        }
      }

      if (lower.startsWith('bpm=')) {
        const bpm = parseInt(part.split('=')[1], 10);
        if (bpm > 0 && bpm < 600) {
          filters.bpm = bpm;
        }
      }
    }

    return filters;
  }

  async findMaps(mmr: number, range: number, filters?: MapFilters): Promise<MapModel[]> {
    const where: Prisma.MapWhereInput = {
      pool: {
        averageMMR: {
          gte: mmr - range,
          lte: mmr + range,
        },
      },
    };

    if (filters?.mod) {
      where.mod = filters.mod;
    }

    if (filters?.starRating) {
      where.starRating = {
        gte: filters.starRating - 0.1,
        lte: filters.starRating + 0.1,
      };
    }

    if (filters?.bpm) {
      where.bpm = filters.bpm;
    }

    return this.prisma.map.findMany({ where });
  }

  pickRandom(maps: MapModel[]): MapModel | undefined {
    if (maps.length === 0) return undefined;
    return maps[Math.floor(Math.random() * maps.length)];
  }

  formatMessage(map: MapModel | undefined): string | [string, string] {
    if (!map) {
      return 'Map not found for that filter. Please try another filter and make sure to use full names for mods.';
    }

    const line1 = `[https://osu.ppy.sh/b/${map.mapId} ${map.mapName} ★ ${map.starRating.toFixed(2)}] - MMR: ${map.mmr.toFixed(0)} - ${map.poolName}`;
    const line2 = `${map.mapName} [${map.difficultyName}] |⌚ ${this.convertTime(map.length)} | ♪ ${map.bpm} | MOD=${map.mod}`;
    return [line1, line2];
  }

  private convertTime(duration: number): string {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~(duration % 60);

    let ret = '';
    if (hrs > 0) {
      ret += hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += mins + ':' + (secs < 10 ? '0' : '');
    ret += secs;
    return ret;
  }
}
