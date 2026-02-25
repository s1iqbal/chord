import { useState, useEffect, useCallback } from 'react';
import { poolsApi, mapsApi } from '../api';
import type {
  PoolData,
  PoolWithMaps,
  MapData,
  PaginatedResponse,
  CreatePoolPayload,
  CreateMapPayload,
} from '../types';
import { PoolCard } from '../components/manage/PoolCard';
import { PoolFormModal } from '../components/manage/PoolFormModal';
import { MapFormModal } from '../components/manage/MapFormModal';
import { ConfirmDialog } from '../components/manage/ConfirmDialog';
import { Pagination } from '../components/manage/Pagination';
import styles from './ManagePage.module.css';

type ModalState =
  | { type: 'none' }
  | { type: 'createPool' }
  | { type: 'editPool'; pool: PoolData }
  | { type: 'deletePool'; pool: PoolData }
  | { type: 'addMap'; poolId: number; poolName: string }
  | { type: 'editMap'; poolId: number; poolName: string; map: MapData }
  | { type: 'deleteMap'; map: MapData };

export function ManagePage() {
  const [pools, setPools] = useState<PaginatedResponse<PoolData> | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedPoolId, setExpandedPoolId] = useState<number | null>(null);
  const [expandedPool, setExpandedPool] = useState<PoolWithMaps | null>(
    null,
  );
  const [loadingMaps, setLoadingMaps] = useState(false);

  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const loadPools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await poolsApi.list({ search: search || undefined, page });
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pools');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  const loadPoolDetail = useCallback(async (id: number) => {
    setLoadingMaps(true);
    try {
      const data = await poolsApi.get(id);
      setExpandedPool(data);
    } catch {
      setExpandedPool(null);
    } finally {
      setLoadingMaps(false);
    }
  }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  useEffect(() => {
    if (expandedPoolId) {
      loadPoolDetail(expandedPoolId);
    } else {
      setExpandedPool(null);
    }
  }, [expandedPoolId, loadPoolDetail]);

  const handleToggleExpand = (poolId: number) => {
    setExpandedPoolId((prev) => (prev === poolId ? null : poolId));
  };

  // Search with debounce reset of page
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Pool CRUD handlers
  const handleCreatePool = async (data: CreatePoolPayload) => {
    await poolsApi.create(data);
    setModal({ type: 'none' });
    await loadPools();
  };

  const handleUpdatePool = async (
    id: number,
    data: Partial<CreatePoolPayload>,
  ) => {
    await poolsApi.update(id, data);
    setModal({ type: 'none' });
    await loadPools();
    if (expandedPoolId === id) {
      await loadPoolDetail(id);
    }
  };

  const handleDeletePool = async (id: number) => {
    await poolsApi.remove(id);
    setModal({ type: 'none' });
    if (expandedPoolId === id) {
      setExpandedPoolId(null);
    }
    await loadPools();
  };

  // Map CRUD handlers
  const handleAddMap = async (poolId: number, data: CreateMapPayload) => {
    await mapsApi.addToPool(poolId, data);
    setModal({ type: 'none' });
    await loadPoolDetail(poolId);
    await loadPools(); // refresh map counts
  };

  const handleUpdateMap = async (
    mapId: number,
    data: Partial<CreateMapPayload>,
  ) => {
    await mapsApi.update(mapId, data);
    setModal({ type: 'none' });
    if (expandedPoolId) {
      await loadPoolDetail(expandedPoolId);
    }
  };

  const handleDeleteMap = async (mapId: number) => {
    await mapsApi.remove(mapId);
    setModal({ type: 'none' });
    if (expandedPoolId) {
      await loadPoolDetail(expandedPoolId);
      await loadPools(); // refresh map counts
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Pools</h1>
        <button
          className={styles.createBtn}
          onClick={() => setModal({ type: 'createPool' })}
        >
          + New Pool
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search pools by name..."
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading && !pools && (
        <div className={styles.loading}>Loading pools...</div>
      )}

      {pools && pools.data.length === 0 && (
        <div className={styles.empty}>
          {search
            ? 'No pools match your search.'
            : 'No pools yet. Create one to get started.'}
        </div>
      )}

      {pools?.data.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          isExpanded={expandedPoolId === pool.id}
          expandedData={
            expandedPoolId === pool.id ? expandedPool : null
          }
          loadingMaps={expandedPoolId === pool.id && loadingMaps}
          onToggleExpand={() => handleToggleExpand(pool.id)}
          onEdit={() => setModal({ type: 'editPool', pool })}
          onDelete={() => setModal({ type: 'deletePool', pool })}
          onAddMap={() =>
            setModal({
              type: 'addMap',
              poolId: pool.id,
              poolName: pool.name,
            })
          }
          onEditMap={(map) =>
            setModal({
              type: 'editMap',
              poolId: pool.id,
              poolName: pool.name,
              map,
            })
          }
          onDeleteMap={(map) => setModal({ type: 'deleteMap', map })}
        />
      ))}

      {pools && (
        <Pagination
          page={pools.meta.page}
          totalPages={pools.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      {modal.type === 'createPool' && (
        <PoolFormModal
          onSave={handleCreatePool}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'editPool' && (
        <PoolFormModal
          pool={modal.pool}
          onSave={(data) => handleUpdatePool(modal.pool.id, data)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'deletePool' && (
        <ConfirmDialog
          title="Delete Pool"
          message={`Are you sure you want to delete "${modal.pool.name}"? This will also delete all ${modal.pool.mapCount} maps in this pool. This cannot be undone.`}
          onConfirm={() => handleDeletePool(modal.pool.id)}
          onCancel={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'addMap' && (
        <MapFormModal
          poolId={modal.poolId}
          poolName={modal.poolName}
          onSave={(data) => handleAddMap(modal.poolId, data)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'editMap' && (
        <MapFormModal
          poolId={modal.poolId}
          poolName={modal.poolName}
          map={modal.map}
          onSave={(data) => handleUpdateMap(modal.map.id, data)}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'deleteMap' && (
        <ConfirmDialog
          title="Delete Map"
          message={`Are you sure you want to delete "${modal.map.mapName} [${modal.map.difficultyName}]"? This cannot be undone.`}
          onConfirm={() => handleDeleteMap(modal.map.id)}
          onCancel={() => setModal({ type: 'none' })}
        />
      )}
    </div>
  );
}
