import { useState } from "react";

export function SearchPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // State for filter values and their active status
  const [values, setValues] = useState({ mmr: 2000, mod: "HIDDEN", stars: 5.0, bpm: 150 });
  const [active, setActive] = useState({ mmr: true, mod: true, stars: false, bpm: false });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // Build command: Starts with !r, then appends active filters
  const buildCommand = () => {
    let cmd = "!r";
    if (active.mmr) cmd += ` ${values.mmr}`;
    if (active.mod) cmd += ` mod=${values.mod}`;
    if (active.stars) cmd += ` stars=${values.stars.toFixed(2)}`;
    if (active.bpm) cmd += ` bpm=${values.bpm}`;
    return cmd;
  };

  const command = buildCommand();

  const runCommand = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/recommend/list?command=${encodeURIComponent(command)}`);
      setResult(await res.json());
    } finally { setLoading(false); }
  };

  // Pagination Logic
  const mapList = Array.isArray(result?.map) ? result.map : [];
  const totalPages = Math.ceil(mapList.length / itemsPerPage);
  const paginatedMaps = mapList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4 text-slate-100">
      <h1 className="text-2xl font-bold">Chord Bot Console</h1>

      {/* Filter Builder UI */}
      <div className="bg-slate-800 p-6 rounded-lg space-y-4 shadow-xl border border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* MMR Toggle */}
          <div className="p-3 border border-slate-700 rounded bg-slate-900">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={active.mmr} onChange={() => setActive({...active, mmr: !active.mmr})} />
              <span className="text-xs font-bold uppercase">MMR: {values.mmr}</span>
            </label>
            <input type="range" disabled={!active.mmr} min="1150" max="3300" step="50" value={values.mmr} onChange={(e) => setValues({...values, mmr: +e.target.value})} className="w-full accent-blue-500 disabled:opacity-50" />
          </div>

          {/* MOD Toggle */}
          <div className="p-3 border border-slate-700 rounded bg-slate-900">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={active.mod} onChange={() => setActive({...active, mod: !active.mod})} />
              <span className="text-xs font-bold uppercase">MOD</span>
            </label>
            <select disabled={!active.mod} value={values.mod} onChange={(e) => setValues({...values, mod: e.target.value})} className="w-full bg-slate-800 text-sm p-1 rounded disabled:opacity-50">
              {['NOMOD', 'HIDDEN', 'HARDROCK', 'DOUBLETIME', 'FREEMOD'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* STARS Toggle */}
          <div className="p-3 border border-slate-700 rounded bg-slate-900">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={active.stars} onChange={() => setActive({...active, stars: !active.stars})} />
              <span className="text-xs font-bold uppercase">STARS</span>
            </label>
            <input type="range" disabled={!active.stars} min="1" max="10" step="0.1" value={values.stars} onChange={(e) => setValues({...values, stars: +e.target.value})} className="w-full mt-2 disabled:opacity-50" />
          </div>

          {/* BPM Toggle */}
          <div className="p-3 border border-slate-700 rounded bg-slate-900">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={active.bpm} onChange={() => setActive({...active, bpm: !active.bpm})} />
              <span className="text-xs font-bold uppercase">BPM</span>
            </label>
            <input type="range" disabled={!active.bpm} min="50" max="300" step="5" value={values.bpm} onChange={(e) => setValues({...values, bpm: +e.target.value})} className="w-full mt-2 disabled:opacity-50" />
          </div>
        </div>

        <button onClick={runCommand} disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-bold transition disabled:opacity-50">
          {loading ? "Searching..." : `Search: ${command}`}
        </button>
      </div>

      {/* Result Cards Grid */}
      {mapList.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-4 text-lg">Matches Found: {mapList.length}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedMaps.map((m: any) => (
              <div key={m.id} className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-lg hover:border-blue-500 transition-all group flex gap-4 items-center">
                <div className="w-24 h-24 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  <img 
                    src={`https://assets.ppy.sh/beatmaps/${m.mapSetId}/covers/card.jpg`} 
                    alt="Map" 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} 
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <a href={`https://osu.ppy.sh/b/${m.mapId}`} target="_blank" rel="noreferrer" className="text-blue-400 font-bold truncate block mb-1 group-hover:underline">
                    {m.mapName}
                  </a>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <p><span className="text-slate-500">Diff:</span> {m.difficultyName}</p>
                    <p><span className="text-slate-500">Stars:</span> {m.starRating.toFixed(2)} ★</p>
                    <p><span className="text-slate-500">BPM/MOD:</span> {m.bpm} | {m.mod}</p>
                    <p className="mt-1 pt-1 border-t border-slate-800 text-slate-400 truncate">
                      <span className="text-slate-500">Pool:</span> {m.poolName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-4 items-center justify-center mt-6 min-h-[40px]">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600">Prev</button>
          <span className="text-sm font-medium">Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50 hover:bg-slate-600">Next</button>
        </div>
      )}
    </div>
  );
}