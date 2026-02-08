import { ShieldCheck, Eye } from 'lucide-react';

const RoleBadge = ({ role, setRole }) => {
  return (
    <div className="fixed top-8 right-8 flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
      <button 
        onClick={() => setRole('presenter')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'presenter' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
      >
        <ShieldCheck size={16} /> Presenter
      </button>
      <button 
        onClick={() => setRole('viewer')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'viewer' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
      >
        <Eye size={16} /> Viewer
      </button>
    </div>
  );
};

export default RoleBadge;
