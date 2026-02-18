import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PoolData {
  version: number;
  name: string;
  link?: string;
  averageMMR: number;
  uuid?: string;
  maps: MapData[];
}

interface MapData {
  mapId: number;
  mod: string;
  mapName: string;
  difficultyName: string;
  length: number;
  starRating: number;
  mapSetId: number;
  maxCombo: number;
  bpm: number;
  downloadAvailable: boolean;
  mmr: number;
  skillset: string;
  sheetId: string;
  pool: string;
}

async function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'updatedPool.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const pools: PoolData[] = JSON.parse(raw);

  console.log(`Seeding ${pools.length} pools...`);

  // Clear existing data
  await prisma.map.deleteMany();
  await prisma.pool.deleteMany();

  let mapCount = 0;

  // Batch insert pools and their maps
  for (const poolData of pools) {
    const pool = await prisma.pool.create({
      data: {
        version: poolData.version,
        name: poolData.name,
        link: poolData.link,
        averageMMR: poolData.averageMMR,
        uuid: poolData.uuid || undefined,
        maps: {
          create: poolData.maps.map((m) => ({
            mapId: m.mapId,
            mod: m.mod,
            mapName: m.mapName,
            difficultyName: m.difficultyName,
            length: m.length,
            starRating: m.starRating,
            mapSetId: m.mapSetId,
            maxCombo: m.maxCombo,
            bpm: m.bpm,
            downloadAvailable: m.downloadAvailable,
            mmr: m.mmr,
            skillset: m.skillset || 'NOT_DEFINED',
            sheetId: m.sheetId,
            poolName: m.pool,
          })),
        },
      },
    });

    mapCount += poolData.maps.length;
    if (mapCount % 1000 < poolData.maps.length) {
      console.log(`  ...seeded ${mapCount} maps so far`);
    }
  }

  console.log(`Done! Seeded ${pools.length} pools and ${mapCount} maps.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
