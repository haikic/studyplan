
import React, { useState } from 'react';
import { Subject, ExamMap, KnowledgeStructureMap } from '../types';
import { architectService } from '../services/geminiService';

interface Props {
  subject: Subject;
  examMap: ExamMap | null;
  onStructureGenerated: (structure: KnowledgeStructureMap) => void;
}

export const KnowledgeStructureLayer: React.FC<Props> = ({ subject, examMap, onStructureGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState<KnowledgeStructureMap | null>(null);

  const handleBuild = async () => {
    if (!examMap) return;
    setLoading(true);
    try {
      const data = await architectService.generateKnowledgeStructure(subject, examMap);
      setStructure(data);
      onStructureGenerated(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getLoadBadge = (load: string) => {
    const colors = {
      low: 'text-green-400 border-green-400/30 bg-green-400/5',
      medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
      high: 'text-red-400 border-red-400/30 bg-red-400/5'
    };
    return colors[load as keyof typeof colors] || 'text-slate-500 border-slate-700 bg-slate-800';
  };

  return (
    <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/40 blueprint-grid min-h-[200px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold mono text-cyan-400 uppercase">层级 02: 知识结构地图</h3>
          <p className="text-xs text-slate-400 mt-1">分析学习负担与逻辑依赖。</p>
        </div>
        {examMap && !structure && (
          <button 
            onClick={handleBuild}
            disabled={loading}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold uppercase rounded transition-all"
          >
            {loading ? '正在分析负载...' : '生成逻辑依赖图'}
          </button>
        )}
      </div>

      {!structure ? (
        <div className="flex flex-col items-center justify-center h-32 text-slate-600">
           <div className="text-[10px] mono mb-2 uppercase tracking-widest">Awaiting Layer 01</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-60 pr-2">
          {structure.nodes.map(node => (
            <div key={node.id} className="p-2 bg-slate-900/60 border border-slate-700 rounded flex justify-between items-center group hover:border-cyan-500/50 transition-all">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${node.type === 'atomic' ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                  <span className="text-xs font-semibold text-slate-300">{node.label}</span>
                  <span className={`text-[9px] px-1 border rounded mono uppercase ${getLoadBadge(node.estimatedLoad)}`}>{node.estimatedLoad} Load</span>
                </div>
                {node.prerequisites.length > 0 && (
                  <div className="mt-1 text-[9px] text-slate-500">
                    <span className="mono text-cyan-500/70">Pre-req:</span> {node.prerequisites.join(', ')}
                  </div>
                )}
              </div>
              <div className="text-[10px] mono text-slate-600">Complex: {node.estimatedComplexity}/10</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
