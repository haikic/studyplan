
import React from 'react';
import { Subject, ExamMap, TimeConstraints, WeeklyPlan, KnowledgeStructureMap } from '../types';
import { SUBJECT_PHASE_MODELS } from '../constants';

interface Props {
  subject: Subject;
  examMap: ExamMap | null;
  knowledgeStructure: KnowledgeStructureMap | null;
  constraints: TimeConstraints;
  onGenerate: () => void;
  loading: boolean;
  plan: WeeklyPlan | null;
}

export const PlanGeneratorLayer: React.FC<Props> = ({ 
  subject, examMap, knowledgeStructure, constraints, onGenerate, loading, plan 
}) => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  const isLocked = examMap && knowledgeStructure && constraints.weeklyTargetTopics.length > 0;

  return (
    <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/40">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold mono text-orange-400 uppercase">层级 05: 周计划生成 (Synthesis)</h3>
          <p className="text-xs text-slate-400 mt-1">基于 Layer 02 的逻辑依赖与 Layer 03 的认知模型。</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading || !isLocked}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-orange-900/20"
        >
          {loading ? '正在执行算法...' : '生成执行计划'}
        </button>
      </div>

      {!plan ? (
        <div className="h-48 border-2 border-dashed border-slate-800 rounded flex flex-col items-center justify-center space-y-3">
          <span className="text-xs text-slate-600 mono text-center px-4">
            {!examMap ? '等待层级 01...' : !knowledgeStructure ? '等待层级 02 逻辑分析...' : constraints.weeklyTargetTopics.length === 0 ? '请在层级 04 选定本周目标话题' : '准备就绪'}
          </span>
          {!isLocked && (
            <div className="flex gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${examMap ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${knowledgeStructure ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${constraints.weeklyTargetTopics.length > 0 ? 'bg-purple-500' : 'bg-slate-800'}`}></div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {plan.allocations.filter(a => a.tasks.length > 0).map((dayPlan) => (
            <div key={dayPlan.day} className="border border-slate-700 rounded bg-slate-900/40 overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                <span className="text-xs font-bold text-slate-300">{days[dayPlan.day]}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] mono text-slate-500">{dayPlan.tasks.length} 项任务</span>
                </div>
              </div>
              <div className="divide-y divide-slate-800">
                {dayPlan.tasks.map((task, idx) => {
                  const phase = SUBJECT_PHASE_MODELS[subject].phases.find(p => p.id === task.phaseId);
                  const loadColors = {
                    low: 'text-green-400 bg-green-400/10 border-green-400/20',
                    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                    high: 'text-red-400 bg-red-400/10 border-red-400/20'
                  };
                  return (
                    <div key={idx} className="p-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-orange-400 mono uppercase border border-orange-400/30 px-1.5 py-0.5 rounded bg-orange-400/5">
                            {phase?.name || task.phaseId}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{task.topicId}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border mono uppercase ${loadColors[task.load] || 'text-slate-500 border-slate-700'}`}>
                          {task.load} Load
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pl-1 border-l border-slate-700">
                        {task.instruction}
                      </p>
                      <div className="mt-2 text-[9px] text-slate-600 flex gap-2 mono">
                        <span>[OBJ]: {phase?.objective}</span>
                        <span className="ml-auto">ARCH_REF: {task.topicId.substring(0,6)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
