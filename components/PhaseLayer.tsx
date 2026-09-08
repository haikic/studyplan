
import React from 'react';
import { Subject } from '../types';
import { SUBJECT_PHASE_MODELS } from '../constants';

export const PhaseLayer: React.FC<{ subject: Subject }> = ({ subject }) => {
  const model = SUBJECT_PHASE_MODELS[subject];

  return (
    <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/40">
      <div className="mb-4">
        <h3 className="text-sm font-bold mono text-emerald-400 uppercase">层级 03: 学习阶段模型 (Phase Map)</h3>
        <p className="text-xs text-slate-400 mt-1">特定学科的认知解构逻辑。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {model.phases.map((phase, idx) => (
          <div key={phase.id} className="p-3 border border-slate-700 rounded bg-slate-900/50 hover:bg-slate-900 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 mono">阶段 0{idx + 1}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-200">{phase.name}</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{phase.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {phase.tools.map(tool => (
                <span key={tool} className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">{tool}</span>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800">
              <span className="text-[9px] text-slate-600 mono uppercase">目标: {phase.objective}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
