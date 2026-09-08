
import React from 'react';
import { TimeConstraints, ExamMap } from '../types';

interface Props {
  examMap: ExamMap | null;
  constraints: TimeConstraints;
  onChange: (c: TimeConstraints) => void;
}

export const ConstraintLayer: React.FC<Props> = ({ examMap, constraints, onChange }) => {
  const updateAvailableDay = (dayIndex: number, value: string) => {
    const newHours = [...constraints.availableStudyHoursPerDay];
    newHours[dayIndex] = parseInt(value) || 0;
    onChange({ ...constraints, availableStudyHoursPerDay: newHours });
  };

  const toggleTopic = (topic: string) => {
    const newTargets = constraints.weeklyTargetTopics.includes(topic)
      ? constraints.weeklyTargetTopics.filter(t => t !== topic)
      : [...constraints.weeklyTargetTopics, topic];
    onChange({ ...constraints, weeklyTargetTopics: newTargets });
  };

  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (
    <div className="p-6 border border-slate-700 rounded-lg bg-slate-800/40">
      <div className="mb-4">
        <h3 className="text-sm font-bold mono text-purple-400 uppercase">层级 04: 时间约束与 Planner 导入</h3>
        <p className="text-xs text-slate-400 mt-1">导入学校进度并选定本周待处理话题。</p>
      </div>

      <div className="space-y-4">
        {/* Planner 导入区 */}
        <div>
          <label className="text-[10px] mono text-slate-500 block mb-1">导入学校 Planner / 周进度文本</label>
          <textarea
            className="w-full h-20 bg-slate-900 border border-slate-700 rounded p-2 text-xs mono focus:border-purple-500 outline-none"
            placeholder="粘贴学校给出的本周教学安排..."
            value={constraints.schoolPlannerInput}
            onChange={(e) => onChange({...constraints, schoolPlannerInput: e.target.value})}
          />
        </div>

        {/* 话题勾选区 */}
        {examMap && (
          <div>
            <label className="text-[10px] mono text-slate-500 block mb-1">从考纲选择本周目标 (Target Topics)</label>
            <div className="max-h-40 overflow-y-auto border border-slate-700 rounded bg-slate-900/50 p-2 space-y-1">
              {examMap.chapters.map(ch => (
                <div key={ch.id} className="space-y-1">
                  <div className="text-[9px] font-bold text-slate-600 uppercase border-b border-slate-800 pb-0.5 mb-1">{ch.title}</div>
                  {ch.subtopics.map(st => (
                    <label key={st} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-800 rounded cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={constraints.weeklyTargetTopics.includes(st)}
                        onChange={() => toggleTopic(st)}
                        className="w-3 h-3 rounded bg-slate-700 border-none text-purple-500"
                      />
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-200">{st}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 可用时间 */}
        <div>
          <label className="text-[10px] mono text-slate-500 block mb-1 uppercase">每日可用学习时长 (小时)</label>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-[9px] mono text-slate-600 mb-1">{day}</div>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-center mono text-purple-300"
                  value={constraints.availableStudyHoursPerDay[i]}
                  onChange={(e) => updateAvailableDay(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
