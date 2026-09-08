
import React from 'react';

export const ArchitectHeader: React.FC = () => {
  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-blue-400">
          学习系统架构师 <span className="text-slate-500 font-normal">v1.0.4</span>
        </h1>
        <p className="text-xs text-slate-400 mono mt-1">模块: 比利时_ASO_G3_核心课程</p>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] mono uppercase tracking-widest text-slate-300">系统就绪</span>
        </div>
      </div>
    </header>
  );
};
