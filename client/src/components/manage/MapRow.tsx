import type { MapData } from '../../types';
import styles from './MapRow.module.css';

const MOD_COLORS: Record<string, string> = {
  NOMOD: '#888',
  FREEMOD: '#a855f7',
  HIDDEN: '#eab308',
  HARDROCK: '#ef4444',
  DOUBLETIME: '#3b82f6',
  TIEBREAKER: '#ff6b9d',
};

interface MapRowProps {
  map: MapData;
  onEdit: () => void;
  onDelete: () => void;
}

export function MapRow({ map, onEdit, onDelete }: MapRowProps) {
  const modColor = MOD_COLORS[map.mod] || '#888';

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <a
          className={styles.mapName}
          href={`https://osu.ppy.sh/b/${map.mapId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {map.mapName}
        </a>
        <span className={styles.difficulty}>[{map.difficultyName}]</span>
      </div>
      <div className={styles.details}>
        <span className={styles.modBadge} style={{ borderColor: modColor, color: modColor }}>
          {map.mod}
        </span>
        <span className={styles.stat}>&#9733; {map.starRating.toFixed(2)}</span>
        <span className={styles.stat}>&#9834; {map.bpm}</span>
        <span className={styles.stat}>MMR: {map.mmr.toFixed(0)}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onEdit} title="Edit map">
          Edit
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={onDelete}
          title="Delete map"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
