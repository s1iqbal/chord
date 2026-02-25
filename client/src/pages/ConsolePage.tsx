import { useState, useRef, useCallback } from 'react';
import { CommandInput } from '../components/CommandInput';
import { PresetButtons } from '../components/PresetButtons';
import { ResultPanel } from '../components/ResultPanel';
import { History } from '../components/History';
import type { RecommendResponse, HistoryEntry } from '../types';
import styles from './ConsolePage.module.css';

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/recommend`;

export function ConsolePage() {
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${API_URL}?command=${encodeURIComponent(command.trim())}`
      );
      const data: RecommendResponse = await res.json();
      setResult(data);
      setHistory((prev) =>
        [{ command: command.trim(), result: data, timestamp: Date.now() }, ...prev].slice(0, 20)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
      inputRef.current?.select();
    }
  }, []);

  return (
    <>
      <h1 className={styles.title}>Chord Bot Test Console</h1>
      <p className={styles.subtitle}>
        Test IRC commands without connecting to Bancho. Results come from the database.
      </p>

      <CommandInput ref={inputRef} onSubmit={runCommand} loading={loading} />
      <PresetButtons onSelect={runCommand} />
      <ResultPanel result={result} loading={loading} error={error} />
      {history.length > 0 && (
        <History entries={history} onReplay={runCommand} />
      )}
    </>
  );
}
