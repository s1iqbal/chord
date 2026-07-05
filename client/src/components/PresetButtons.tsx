import { useState } from 'react';

const PRESETS = ['!r 1500', '!r 2000 mod=hidden', '!r 1500 mod=hardrock stars=4.52 bpm=93', '!r 2500 mod=doubletime', '!r 1800 stars=5.5', '!r', '!help'];

export function PresetButtons({ onSelect }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visiblePresets = isExpanded ? PRESETS : PRESETS.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {visiblePresets.map((cmd) => (
        <button
          key={cmd}
          className="bg-slate-700 hover:bg-slate-600 text-[10px] px-3 py-1 rounded-md transition uppercase tracking-wider text-slate-200"
          onClick={() => onSelect(cmd)}
        >
          {cmd === '!r' ? '!r (random)' : cmd}
        </button>
      ))}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[10px] px-3 py-1 text-blue-400 hover:text-blue-300 uppercase tracking-wider"
      >
        {isExpanded ? 'Show Less' : `+ ${PRESETS.length - 3} More`}
      </button>
    </div>
  );
}