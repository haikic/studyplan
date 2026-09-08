
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, ExamMap, WeeklyPlan, TimeConstraints, KnowledgeStructureMap } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const architectService = {
  async generateExamMap(tocText: string, subject: Subject): Promise<ExamMap> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `分析 ${subject} 目录，生成 Exam Map JSON。目录：${tocText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                  subtopics: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}') as ExamMap;
  },

  async generateKnowledgeStructure(subject: Subject, examMap: ExamMap): Promise<KnowledgeStructureMap> {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `基于考纲：${JSON.stringify(examMap)}
      拆解为逻辑节点。要求：
      1. 必须包含 estimatedLoad (low/medium/high) 和 estimatedComplexity (1-10)。
      2. 标注前置依赖 prerequisites。
      3. 每个子话题必须被映射到至少一个节点。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['atomic', 'synthesis'] },
                  prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedLoad: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                  estimatedComplexity: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}') as KnowledgeStructureMap;
  },

  async generateWeeklyPlan(
    subject: Subject, 
    examMap: ExamMap, 
    structure: KnowledgeStructureMap,
    constraints: TimeConstraints, 
    phaseModel: any
  ): Promise<WeeklyPlan> {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `生成周计划。核心规则：
      1. 每个话题必须经历 Phase 1-4。
      2. 每天最多 1 个 'high' 负担任务。
      3. 同一天禁止两个 Phase 1 的 Medium/High 任务。
      4. 任何新知识 Phase 1 后 48 小时内必须安排 Phase 2。
      
      数据上下文：
      结构：${JSON.stringify(structure)}
      模型：${JSON.stringify(phaseModel)}
      约束：${JSON.stringify(constraints)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allocations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        phaseId: { type: Type.STRING },
                        topicId: { type: Type.STRING },
                        load: { type: Type.STRING },
                        instruction: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}') as WeeklyPlan;
  }
};
