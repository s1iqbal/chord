import { useState, useRef, useEffect } from 'react';
import { CommandInput } from '../components/CommandInput';
import { PresetButtons } from '../components/PresetButtons';
import { ResultPanel } from '../components/ResultPanel';
import { History } from '../components/History';

export function AboutPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history') || '[]'));
  
  useEffect(() => localStorage.setItem('history', JSON.stringify(history)), [history]);

  const runCommand = async (command: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/recommend?command=${encodeURIComponent(command)}`);
      const data = await res.json();
      setResult(data);
      setHistory((prev: any) => [{ command, result: data, timestamp: Date.now() }, ...prev].slice(0, 20));
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chord Bot Console</h1>
      <CommandInput value={currentCommand} onChange={setCurrentCommand} onSubmit={runCommand} loading={loading} />
      <PresetButtons onSelect={runCommand} />
      <ResultPanel result={result} loading={loading} error={null} />
      <History entries={history} onReplay={runCommand} onDelete={(i: number) => setHistory((p: any) => p.filter((_: any, idx: number) => idx !== i))} onClear={() => setHistory([])} />
    </div>
  );
}