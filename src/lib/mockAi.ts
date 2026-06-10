import type { AnalysisResult, ApplicantProfile } from "../types/application";

export const buildMockAiReply = (
  profile: ApplicantProfile,
  result: AnalysisResult,
  prompt: string
) => {
  const topMatch = result.matchSchools[0];
  const topStretch = result.stretchSchools[0];
  const topSafety = result.safetySchools[0];

  return [
    `收到，你的问题是“${prompt}”。我是小留学长，会先按首经贸真实案例库做规则化初筛。`,
    `以 ${profile.major || "当前专业"}、GPA ${profile.gpa.toFixed(2)}、目标 ${profile.targetRegions.join("、")}/${profile.direction} 来看：${result.summary}`,
    `建议组合：冲刺 ${topStretch?.school ?? "待补充"}，匹配 ${topMatch?.school ?? "待补充"}，保底 ${topSafety?.school ?? "待补充"}。`,
    "下一步最关键的是把实习职责、课程项目、语言成绩和推荐人素材补齐，再进入文书策略。"
  ].join("\n\n");
};
