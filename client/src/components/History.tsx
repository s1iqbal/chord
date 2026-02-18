import type { HistoryEntry } from '../types';
import styles from './History.module.css';

interface Props {
  entries: HistoryEntry[];
  onReplay: (command: string) => void;
}

export function History({ entries, onReplay }: Props) {
  return (
    <div className={styles.history}>
      <h3 className={styles.heading}>Command History</h3>
      <div className={styles.list}>
        {entries.map((entry, i) => {
          const matched = entry.result.totalMatches;
          const hasMap = !!entry.result.map;
          return (
            <button
              key={`${entry.timestamp}-${i}`}
              className={styles.entry}
              onClick={() => onReplay(entry.command)}
              title="Click to replay"
            >
              <span className={styles.cmd}>{entry.command}</span>
              <span className={styles.info}>
                {matched !== undefined
                  ? `${matched} match${matched !== 1 ? 'es' : ''}`
                  : hasMap
                    ? 'ok'
                    : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
