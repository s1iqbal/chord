export function ResultPanel({ result, loading }: any) {
  if (loading) return <div className="text-blue-400 text-sm text-center animate-pulse">Querying...</div>;
  if (!result) return null;

  const { map } = result;

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl space-y-4 text-slate-100">
      {map && (
        <div className="space-y-3">
          <img src={`https://assets.ppy.sh/beatmaps/${map.mapSetId}/covers/card.jpg`} className="w-full h-32 object-cover rounded-lg" />
          <div className="space-y-1 text-center animate-pulse ">
            <h2 className="text-lg font-bold leading-tight font-semibold uppercase">{map.mapName}</h2>
            <p className="text-blue-400 text-sm font-semibold">{map.difficultyName}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 px-2 py-2 text-xs bg-slate-950/50 rounded-lg border border-slate-700 shadow-inner text-slate-100">
        {/* Added col-span-2 here to make it span both columns */}
        <div className="col-span-2"><span className="text-slate-500">Pool:</span> {map?.poolName}</div>
        <div><span className="text-slate-500">MMR:</span> {map?.mmr?.toFixed(0)}</div>
        <div><span className="text-slate-500">Stars:</span> {map?.starRating?.toFixed(2)}</div>
        <div><span className="text-slate-500">BPM:</span> {map?.bpm}</div>
        <div><span className="text-slate-500">Combo:</span> {map?.maxCombo}</div>
        <div className="col-span-2"><span className="text-slate-500">Mod:</span> {map?.mod}</div>
      </div>

      <details className="pt-2 border-t border-slate-700 text-slate-400 text-xs">
        <summary className="cursor-pointer text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest text-center">View Raw JSON</summary>
        <pre className="bg-black p-3 mt-2 rounded text-[9px] overflow-auto text-slate-400 max-h-40">{JSON.stringify(result, null, 2)}</pre>
      </details>
    </div>
  );
}