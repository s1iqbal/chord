import type { RecommendResponse } from '../types';
import styles from './ResultPanel.module.css';

interface Props {
  result: RecommendResponse | null;
  loading: boolean;
  error: string | null;
}

function linkify(text: string): string {
  return text.replace(
    /\[https:\/\/osu\.ppy\.sh\/b\/(\d+)\s+([^\]]+)\]/g,
    '<a href="https://osu.ppy.sh/b/$1" target="_blank" rel="noopener">$2</a>'
  );
}

export function ResultPanel({ result, loading, error }: Props) {
  if (loading) {
    return <div className={styles.panel}><span className={styles.meta}>Querying...</span></div>;
  }

  if (error) {
    return <div className={styles.panel}><span className={styles.error}>Request failed: {error}</span></div>;
  }

  if (!result) {
    return <div className={styles.panel}>Type a command above and hit Send (or press Enter).</div>;
  }

  return (
    <div className={styles.panel}>
      {result.command && (
        <div className={styles.meta}>Command: {result.command}</div>
      )}
      {result.randomMMR !== undefined && (
        <div className={styles.meta}>Random MMR selected: {result.randomMMR}</div>
      )}
      {result.totalMatches !== undefined && (
        <div className={styles.meta}>Maps matched: {result.totalMatches}</div>
      )}
      {result.filtersApplied && (
        <div className={styles.meta}>
          Filters: {JSON.stringify(result.filtersApplied)}
        </div>
      )}

      <hr className={styles.separator} />

      {result.messages?.map((msg, i) => (
        <div
          key={i}
          className={styles.msg}
          dangerouslySetInnerHTML={{ __html: linkify(msg) }}
        />
      ))}

      {result.error && (
        <>
          <div className={styles.error}>{result.error}</div>
          {result.examples && (
            <div className={styles.meta}>
              <div>Examples:</div>
              {result.examples.map((ex, i) => (
                <div key={i}>&nbsp;&nbsp;{ex}</div>
              ))}
            </div>
          )}
        </>
      )}

      {result.map && (
        <>
          <hr className={styles.separator} />
          <div className={styles.meta}>Raw map data:</div>
          <pre className={styles.json}>
            {JSON.stringify(result.map, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
