import { ChevronLeft, ChevronRight } from 'lucide-react';

const Controls = ({ onNext, onPrev, current, total }) => {
  return (
    <div className="flex items-center gap-6 mt-12 bg-slate-900 p-3 rounded-full border border-slate-700 shadow-xl">
      <button 
        disabled={current === 0}
        onClick={onPrev}
        className="p-3 text-white hover:bg-slate-800 disabled:opacity-30 rounded-full transition-colors"
      >
        <ChevronLeft size={28} />
      </button>
      
      <span className="text-slate-400 font-mono text-sm">
        {current + 1} / {total}
      </span>

      <button 
        disabled={current === total - 1}
        onClick={onNext}
        className="p-3 text-white hover:bg-slate-800 disabled:opacity-30 rounded-full transition-colors"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default Controls;
