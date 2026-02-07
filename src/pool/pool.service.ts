import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  async findPoolsByMMR(mmr: number, range: number = 50) {
    const lowerMMR = mmr - range;
    const upperMMR = mmr + range;

    return this.prisma.pool.findMany({
      where: {
        averageMMR: {
          gte: lowerMMR,
          lte: upperMMR,
        },
      },
      include: { maps: true },
    });
  }
}
