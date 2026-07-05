import { forwardRef } from 'react';

export const CommandInput = forwardRef(({ value, onChange, onSubmit, loading }: any, ref: any) => {
  return (
    <div className="flex gap-2 w-full">
      <input
        ref={ref}
        className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-2.5 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value)}
        placeholder="!r 1500..."
      />
      <button 
        className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase transition-all 
                    ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
        onClick={() => onSubmit(value)}
        disabled={loading || !value.trim()}
      >
        {loading ? '...' : 'Send'}
      </button>
    </div>
  );
});