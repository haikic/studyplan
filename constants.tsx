
import { Subject, SubjectPhaseModel } from './types';

export const SUBJECT_PHASE_MODELS: Record<Subject, SubjectPhaseModel> = {
  [Subject.MATH]: {
    subject: Subject.MATH,
    phases: [
      { id: 'm1', name: '① 初次理解', description: '看例子、理解定义、建立概念。', objective: '建立概念直觉', tools: ['概念图', '示例解析'] },
      { id: 'm2', name: '② 方法熟悉', description: '跟着标准步骤做题，确保不卡程序。', objective: '算法熟练度', tools: ['模版题', '步骤拆解'] },
      { id: 'm3', name: '③ 变式应用', description: '换条件、混合题型，防止机械记忆。', objective: '抽象迁移', tools: ['综合习题', '条件变换'] },
      { id: 'm4', name: '④ 巩固/回看', description: '快速回忆、错题复盘，防止遗忘。', objective: '长期记忆', tools: ['错题集', '记忆卡片'] }
    ]
  },
  [Subject.PHYSICS]: {
    subject: Subject.PHYSICS,
    phases: [
      { id: 'p1', name: '现象提取', description: '识别物理变量。', objective: '变量识别', tools: ['数据表'] },
      { id: 'p2', name: '数学建模', description: '套用控制方程。', objective: '模型匹配', tools: ['方程组'] },
      { id: 'p3', name: '边界求解', description: '特定条件下计算。', objective: '计算精确', tools: ['微积分'] },
      { id: 'p4', name: '系统验证', description: '误差分析。', objective: '结果评估', tools: ['误差曲线'] }
    ]
  },
  [Subject.CHEMISTRY]: {
    subject: Subject.CHEMISTRY,
    phases: [
      { id: 'c1', name: '成分剖析', description: '结构性质。', objective: '物质理解', tools: ['周期表'] },
      { id: 'c2', name: '反应建模', description: '电子流向与成键。', objective: '机制掌握', tools: ['机理图'] },
      { id: 'c3', name: '动力学计算', description: '能量与平衡。', objective: '过程预测', tools: ['热力学图'] },
      { id: 'c4', name: '实验转化', description: '定量计算。', objective: '产率控制', tools: ['摩尔比'] }
    ]
  },
  [Subject.BIOLOGY]: {
    subject: Subject.BIOLOGY,
    phases: [
      { id: 'b1', name: '分类记忆', description: '层级归属。', objective: '类别锁定', tools: ['进化树'] },
      { id: 'b2', name: '生理机制', description: '结构与功能。', objective: '机制关联', tools: ['解剖图'] },
      { id: 'b3', name: '生化流转', description: '物质循环。', objective: '动态闭环', tools: ['流程图'] },
      { id: 'b4', name: '系统反馈', description: '生态互联。', objective: '宏观视野', tools: ['反馈环'] }
    ]
  }
};
