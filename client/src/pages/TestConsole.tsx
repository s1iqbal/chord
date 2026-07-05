import { useState, useEffect, useRef } from 'react';
import { CommandInput } from '../components/CommandInput';
import { PresetButtons } from '../components/PresetButtons';
import { ResultPanel } from '../components/ResultPanel';
import { History } from '../components/History';

export function TestConsole() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history') || '[]'));
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => localStorage.setItem('history', JSON.stringify(history)), [history]);

  const runCommand = async (command: string) => {
    if (!command.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/recommend?command=${encodeURIComponent(command)}`);
      const data = await res.json();
      setResult(data);
      setHistory((prev: any) => [{ command, result: data, timestamp: Date.now() }, ...prev].slice(0, 20));
    } finally { setLoading(false); }
  };

  const handlePreset = (command: string) => {
    setCurrentCommand(command);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 space-y-6 text-slate-100">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Chord Bot Console</h1>
        <p className="text-xs text-slate-400">Test IRC commands & view recommendations</p>
      </div>

      <div className="w-full bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl space-y-4">
        <CommandInput ref={inputRef} value={currentCommand} onChange={setCurrentCommand} onSubmit={runCommand} loading={loading} />
        <PresetButtons onSelect={handlePreset} />
      </div>

      <div className="w-full">
        <ResultPanel result={result} loading={loading} />
      </div>

      <div className="w-full">
        <History 
          entries={history} 
          onReplay={(entry: any) => setResult(entry.result)} 
          onDelete={(i: number) => setHistory((p: any) => p.filter((_: any, idx: number) => idx !== i))} 
          onClear={() => setHistory([])} 
        />
      </div>
    </div>
  );
}