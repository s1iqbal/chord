import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async findAll(options: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.PoolWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [pools, total] = await Promise.all([
      this.prisma.pool.findMany({
        where,
        include: { _count: { select: { maps: true } } },
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.pool.count({ where }),
    ]);

    return {
      data: pools.map((p) => ({
        id: p.id,
        version: p.version,
        name: p.name,
        link: p.link,
        averageMMR: p.averageMMR,
        uuid: p.uuid,
        mapCount: p._count.maps,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: { maps: true },
    });
    if (!pool) throw new NotFoundException(`Pool with id ${id} not found`);
    return pool;
  }

  async create(data: {
    version: number;
    name: string;
    link?: string;
    averageMMR: number;
  }) {
    return this.prisma.pool.create({ data });
  }

  async update(
    id: number,
    data: Partial<{
      version: number;
      name: string;
      link: string;
      averageMMR: number;
    }>,
  ) {
    await this.findOne(id);
    return this.prisma.pool.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pool.delete({ where: { id } });
  }
}
