
import React, { useState } from 'react';
import { Subject, ExamMap } from '../types';
import { architectService } from '../services/geminiService';

interface Props {
  subject: Subject;
  onMapGenerated: (map: ExamMap) => void;
}

const subjectMap: Record<string, string> = {
  'Mathematics': '数学',
  'Physics': '物理',
  'Chemistry': '化学',
  'Biology': '生物'
};

export const ExamMapLayer: React.FC<Props> = ({ subject, onMapGenerated }) => {
  const [tocText, setTocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedMap, setGeneratedMap] = useState<ExamMap | null>(null);

  const handleDeconstruct = async () => {
    if (!tocText.trim()) return;
    setLoading(true);
    try {
      const map = await architectService.generateExamMap(tocText, subject);
      setGeneratedMap(map);
      onMapGenerated(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/40 blueprint-grid">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold mono text-blue-300 uppercase">层级 01: 考纲范围 (Exam Map)</h3>
          <p className="text-xs text-slate-400 mt-1">上传或粘贴课本目录以初始化知识层级。</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 border border-slate-600 rounded text-slate-500 mono">{subjectMap[subject] || subject}</span>
      </div>

      {!generatedMap ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-3 text-sm mono focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="在此粘贴课本目录文本..."
            value={tocText}
            onChange={(e) => setTocText(e.target.value)}
          />
          <button
            onClick={handleDeconstruct}
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all rounded"
          >
            {loading ? '正在进行架构解构...' : '初始化解构'}
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {generatedMap.chapters.map((ch, idx) => (
            <div key={ch.id} className="p-3 bg-slate-900/80 border-l-2 border-blue-500 rounded-r flex justify-between items-center group">
              <div>
                <span className="text-[10px] text-slate-500 mono">章节 {idx + 1}</span>
                <h4 className="text-sm font-semibold">{ch.title}</h4>
                <div className="flex gap-1 mt-1">
                  {ch.subtopics.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{s}</span>
                  ))}
                  {ch.subtopics.length > 3 && <span className="text-[9px] text-slate-600">+{ch.subtopics.length - 3}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 mono">权重</div>
                <div className="text-blue-400 font-bold">{ch.weight}/10</div>
              </div>
            </div>
          ))}
          <button onClick={() => setGeneratedMap(null)} className="text-[10px] text-slate-500 underline hover:text-slate-300">重置考纲</button>
        </div>
      )}
    </div>
  );
};
