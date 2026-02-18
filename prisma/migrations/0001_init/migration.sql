-- CreateTable
CREATE TABLE "pools" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "average_mmr" DOUBLE PRECISION NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" SERIAL NOT NULL,
    "map_id" INTEGER NOT NULL,
    "mod" TEXT NOT NULL,
    "map_name" TEXT NOT NULL,
    "difficulty_name" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "star_rating" DOUBLE PRECISION NOT NULL,
    "map_set_id" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL,
    "download_available" BOOLEAN NOT NULL DEFAULT true,
    "mmr" DOUBLE PRECISION NOT NULL,
    "skillset" TEXT NOT NULL DEFAULT 'NOT_DEFINED',
    "sheet_id" TEXT NOT NULL,
    "pool_name" TEXT NOT NULL,
    "pool_id" INTEGER NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pools_uuid_key" ON "pools"("uuid");

-- CreateIndex
CREATE INDEX "pools_average_mmr_idx" ON "pools"("average_mmr");

-- CreateIndex
CREATE INDEX "maps_mmr_idx" ON "maps"("mmr");

-- CreateIndex
CREATE INDEX "maps_mod_idx" ON "maps"("mod");

-- CreateIndex
CREATE INDEX "maps_bpm_idx" ON "maps"("bpm");

-- CreateIndex
CREATE INDEX "maps_star_rating_idx" ON "maps"("star_rating");

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
