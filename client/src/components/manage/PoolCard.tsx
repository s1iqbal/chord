import type { PoolData, PoolWithMaps, MapData } from '../../types';
import { MapRow } from './MapRow';
import styles from './PoolCard.module.css';

interface PoolCardProps {
  pool: PoolData;
  isExpanded: boolean;
  expandedData: PoolWithMaps | null;
  loadingMaps: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddMap: () => void;
  onEditMap: (map: MapData) => void;
  onDeleteMap: (map: MapData) => void;
}

export function PoolCard({
  pool,
  isExpanded,
  expandedData,
  loadingMaps,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddMap,
  onEditMap,
  onDeleteMap,
}: PoolCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={onToggleExpand}>
        <div className={styles.info}>
          <h3 className={styles.name}>{pool.name}</h3>
          <div className={styles.meta}>
            <span className={styles.badge}>v{pool.version}</span>
            <span className={styles.badge}>
              MMR: {pool.averageMMR.toFixed(0)}
            </span>
            <span className={styles.badge}>{pool.mapCount} maps</span>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit pool"
          >
            Edit
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete pool"
          >
            Delete
          </button>
          <span className={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.body}>
          {pool.link && (
            <div className={styles.link}>
              Link:{' '}
              <a href={pool.link} target="_blank" rel="noopener noreferrer">
                {pool.link}
              </a>
            </div>
          )}

          <div className={styles.mapsHeader}>
            <span className={styles.mapsTitle}>Maps</span>
            <button className={styles.addMapBtn} onClick={onAddMap}>
              + Add Map
            </button>
          </div>

          {loadingMaps && (
            <div className={styles.loading}>Loading maps...</div>
          )}

          {expandedData && expandedData.maps.length === 0 && (
            <div className={styles.empty}>
              No maps in this pool. Click "Add Map" to get started.
            </div>
          )}

          {expandedData?.maps.map((map) => (
            <MapRow
              key={map.id}
              map={map}
              onEdit={() => onEditMap(map)}
              onDelete={() => onDeleteMap(map)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
