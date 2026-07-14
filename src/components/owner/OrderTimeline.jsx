import React from 'react';
import { Check } from 'lucide-react';

const stages = [
  { id: 'pending', label: 'Pending' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' }
];

export default function OrderTimeline({ currentStatus, onStatusChange }) {
  const currentIndex = stages.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700/50 -translate-y-1/2 rounded-full z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />

        {/* Nodes */}
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2 group">
              <button
                onClick={() => onStatusChange(stage.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 border-2 border-slate-600 text-transparent'} ${isCurrent ? 'ring-4 ring-indigo-500/20' : 'hover:scale-110'}`}
              >
                {isCompleted && <Check size={12} strokeWidth={4} />}
              </button>
              <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-5 transition-colors ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
