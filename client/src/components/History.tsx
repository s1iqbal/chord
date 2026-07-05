export function History({ entries, onReplay, onDelete, onClear }: any) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl space-y-4">
      <div className="flex justify-between mb-3 uppercase font-bold text-slate-400 text-xs tracking-widest">
        <h3 className="text-sm font-bold uppercase">History</h3>
        <button onClick={onClear} className="text-[10px] text-red-400 hover:text-red-300 uppercase">Clear</button>
      </div>
      {entries.map((entry: any, i: number) => (
        <div key={i} className="flex gap-2 mb-2 items-center border border-slate-700 rounded-xl shadow-sm p-2 uppercase text-xs tracking-widest">
          <button onClick={() => onReplay(entry)} className="flex-1 bg-slate-700 p-2 text-xs text-left rounded truncate hover:bg-slate-600 transition">
            {entry.command}
          </button>
          <button onClick={() => onDelete(i)} className="text-[10px] text-red-400 hover:text-red-300 font-bold px-2 uppercase ">X</button>
        </div>
      ))}
    </div>
  );
}