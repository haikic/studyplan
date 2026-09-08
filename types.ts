
export enum Subject {
  MATH = 'Mathematics',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology'
}

export interface ExamMap {
  syllabusId: string;
  source: 'Belgium_ASO_G3_Standard';
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  weight: number; 
  subtopics: string[];
}

// 层级 2：核心逻辑节点
export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'atomic' | 'synthesis'; 
  prerequisites: string[]; 
  estimatedLoad: 'low' | 'medium' | 'high'; // 学习负担权重
  estimatedComplexity: number; // 复杂度 1-10
}

export interface KnowledgeStructureMap {
  subject: Subject;
  nodes: KnowledgeNode[];
}

export interface LearningPhase {
  id: string;
  name: string;
  description: string;
  objective: string;
  tools: string[];
}

// 层级 4：约束与计划导入
export interface TimeConstraints {
  availableStudyHoursPerDay: number[]; // 0-6 (Sun-Sat)
  currentWeek: number;
  schoolPlannerInput: string; // 导入的学校周进度/Planner内容
  weeklyTargetTopics: string[]; // 从考纲中选定的本周目标话题 ID
}

export interface WeeklyPlan {
  weekNumber: number;
  allocations: {
    day: number;
    tasks: {
      subject: Subject;
      phaseId: string; 
      topicId: string; 
      load: 'low' | 'medium' | 'high';
      instruction: string; 
    }[];
  }[];
}

export interface SubjectPhaseModel {
  subject: Subject;
  phases: LearningPhase[];
}
