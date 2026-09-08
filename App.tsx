
import React, { useState } from 'react';
import { Subject, ExamMap, TimeConstraints, KnowledgeStructureMap } from './types';
import { ArchitectHeader } from './components/ArchitectHeader';
import { ExamMapLayer } from './components/ExamMapLayer';
import { KnowledgeStructureLayer } from './components/KnowledgeStructureLayer';
import { PhaseLayer } from './components/PhaseLayer';
import { ConstraintLayer } from './components/ConstraintLayer';
import { PlanGeneratorLayer } from './components/PlanGeneratorLayer';
import { architectService } from './services/geminiService';
import { SUBJECT_PHASE_MODELS } from './constants';

const subjectLabelMap: Record<Subject, string> = {
  [Subject.MATH]: '数学 (Math)',
  [Subject.PHYSICS]: '物理 (Physics)',
  [Subject.CHEMISTRY]: '化学 (Chemistry)',
  [Subject.BIOLOGY]: '生物 (Biology)'
};

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.MATH);
  const [examMap, setExamMap] = useState<ExamMap | null>(null);
  const [knowledgeStructure, setKnowledgeStructure] = useState<KnowledgeStructureMap | null>(null);
  const [constraints, setConstraints] = useState<TimeConstraints>({
    availableStudyHoursPerDay: [2, 3, 3, 4, 3, 2, 5],
    currentWeek: 1,
    schoolPlannerInput: '',
    weeklyTargetTopics: []
  });

  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = async () => {
    if (!examMap || !knowledgeStructure || constraints.weeklyTargetTopics.length === 0) return;
    setIsGenerating(true);
    try {
      const plan = await architectService.generateWeeklyPlan(
        selectedSubject,
        examMap,
        knowledgeStructure,
        constraints,
        SUBJECT_PHASE_MODELS[selectedSubject]
      );
      setWeeklyPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setExamMap(null);
    setKnowledgeStructure(null);
    setWeeklyPlan(null);
    setConstraints({
      ...constraints,
      weeklyTargetTopics: []
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <ArchitectHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {Object.values(Subject).map(s => (
              <button
                key={s}
                onClick={() => {
                  setSelectedSubject(s);
                  handleReset();
                }}
                className={`px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  selectedSubject === s 
                  ? 'bg-blue-600/10 text-blue-400 border-blue-500' 
                  : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {subjectLabelMap[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <ExamMapLayer 
              subject={selectedSubject} 
              onMapGenerated={setExamMap} 
            />

            <KnowledgeStructureLayer 
              subject={selectedSubject}
              examMap={examMap}
              onStructureGenerated={setKnowledgeStructure}
            />

            <ConstraintLayer 
              examMap={examMap}
              constraints={constraints} 
              onChange={setConstraints} 
            />
          </div>

          <div className="lg:col-span-7 space-y-8">
            <PhaseLayer subject={selectedSubject} />

            <PlanGeneratorLayer 
              subject={selectedSubject}
              examMap={examMap}
              knowledgeStructure={knowledgeStructure}
              constraints={constraints}
              onGenerate={generatePlan}
              loading={isGenerating}
              plan={weeklyPlan}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
