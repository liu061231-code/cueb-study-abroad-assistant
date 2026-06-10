import type {
  AnalysisResult,
  ApplicantProfile,
  OfferCase,
  SchoolRecommendation
} from "../types/application";

const gpaTier = (gpa: number) => {
  if (gpa >= 3.65) return "high";
  if (gpa >= 3.35) return "solid";
  return "developing";
};

const hasStrongLanguage = (score: string) =>
  /(7\.0|7\.5|8\.0|100|101|102|103|104|105|106|107|108|109|110|120|125|130|135|140|145|150|155|160|GRE|GMAT)/i.test(
    score
  );

const containsAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));

const selectedRegions = (profile: ApplicantProfile) =>
  profile.targetRegions.length > 0 ? profile.targetRegions : ["英国"];

const scoreCase = (profile: ApplicantProfile, item: OfferCase) => {
  let score = 0;
  const regions = selectedRegions(profile);

  if (regions.includes(item.region)) score += 30;
  if (item.direction === profile.direction) score += 24;
  if (profile.major && item.undergraduateMajor.includes(profile.major.slice(0, 2))) {
    score += 14;
  }

  const gpaGap = Math.abs(profile.gpa - item.gpa);
  score += Math.max(0, 18 - gpaGap * 20);

  if (hasStrongLanguage(profile.languageScore) === hasStrongLanguage(item.language)) {
    score += 8;
  }

  const background = `${profile.internships} ${profile.research}`;
  if (containsAny(background, ["四大", "投行", "券商", "银行", "咨询", "数据", "Python", "SQL"])) {
    score += 10;
  }

  return score;
};

const estimateRate = (profile: ApplicantProfile, item: OfferCase, score: number) => {
  const base = item.tier === "冲刺" ? 38 : item.tier === "匹配" ? 62 : 78;
  const gpaAdjustment = (profile.gpa - item.gpa) * 18;
  const languageAdjustment = hasStrongLanguage(profile.languageScore) ? 5 : -6;
  const fitAdjustment = Math.min(12, Math.max(-8, (score - 55) / 3));
  return Math.round(Math.min(92, Math.max(28, base + gpaAdjustment + languageAdjustment + fitAdjustment)));
};

const reasonsFor = (profile: ApplicantProfile, item: OfferCase) => {
  const sourceLabel = item.sourceType === "公开案例" ? "公开案例" : "模拟补充样本";
  const regions = selectedRegions(profile);
  const reasons = [
    `${sourceLabel}中有 ${item.studentTag} 以 ${item.gpaDisplay ?? `${item.gpa.toFixed(2)} GPA`} 获得 ${item.school} 相关录取`,
    `${item.program} 与你的 ${profile.direction} 目标专业匹配度较高`
  ];

  if (regions.includes(item.region)) {
    reasons.push(`你选择了 ${item.region}，该案例国家/地区路径可作为直接参考`);
  }

  if (Math.abs(profile.gpa - item.gpa) <= 0.15) {
    reasons.push("GPA 与历史录取案例接近，可作为重点参考样本");
  } else if (profile.gpa > item.gpa) {
    reasons.push("你的 GPA 高于该案例，具备更好的学术基础");
  } else {
    reasons.push("GPA 略低于该案例，需要用实习、文书和标化成绩补强");
  }

  return reasons;
};

const groupRecommendations = (
  profile: ApplicantProfile,
  cases: OfferCase[],
  tier: OfferCase["tier"]
): SchoolRecommendation[] => {
  const ranked = cases
    .filter((item) => item.tier === tier)
    .map((item) => ({ item, score: scoreCase(profile, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return ranked.map(({ item, score }) => ({
    school: item.school,
    programs: [item.program],
    region: item.region,
    successRate: estimateRate(profile, item, score),
    reasons: reasonsFor(profile, item),
    relatedCases: [item]
  }));
};

const missingMaterialsFor = (profile: ApplicantProfile) => {
  const missing: string[] = [];

  if (!profile.languageScore || /暂无|无|未考|待考/.test(profile.languageScore)) {
    missing.push("补充雅思/托福/多邻国/PTE等标化成绩截图或考试计划");
  }

  if (!profile.internships.trim() || profile.internships === "暂无相关实习") {
    missing.push("补充与目标专业相关的实习经历和职责成果");
  }

  if (!profile.research.trim()) {
    missing.push("补充科研、竞赛、课程项目或数据分析作品");
  }

  if (profile.gpa < 3.35) {
    missing.push("准备 GPA 解释、核心课程成绩亮点和补充学习证明");
  }

  missing.push("整理英文简历、个人陈述素材、推荐人信息和成绩单扫描件");
  return missing;
};

const timelineFor = (profile: ApplicantProfile) => [
  `现在-2周：确认 ${selectedRegions(profile).join("、")} 申请组合与预算，完成案例库对标`,
  "第3-5周：打磨英文简历、个人陈述主线和推荐信素材",
  selectedRegions(profile).includes("美国")
    ? "第6-10周：准备 GRE/GMAT、网申文书和项目先修课证明"
    : "第6-8周：补齐语言成绩、实习证明、课程描述和作品集材料",
  "开放申请后1个月内：优先递交冲刺与匹配项目，滚动补申保底项目",
  "递交后：每两周追踪状态，根据面试/补件要求调整申请节奏"
];

export const analyzeApplicant = (
  profile: ApplicantProfile,
  cases: OfferCase[]
): AnalysisResult => {
  const matchedCases = cases
    .map((item) => ({ item, score: scoreCase(profile, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item);

  const regionText = selectedRegions(profile).join("、");
  const tier = gpaTier(profile.gpa);
  const summary =
    tier === "high"
      ? `你选择了 ${regionText}，学术背景具备冲刺高排名项目的基础，建议用强相关实习与量化成果拉开差异。`
      : tier === "solid"
        ? `你选择了 ${regionText}，背景适合采用冲刺+匹配+保底的稳健组合，重点提高材料叙事和项目匹配度。`
        : `你选择了 ${regionText}，建议先稳住匹配与保底项目，同时通过语言、实习和课程项目增强竞争力。`;

  return {
    summary,
    stretchSchools: groupRecommendations(profile, cases, "冲刺"),
    matchSchools: groupRecommendations(profile, cases, "匹配"),
    safetySchools: groupRecommendations(profile, cases, "保底"),
    missingMaterials: missingMaterialsFor(profile),
    timeline: timelineFor(profile),
    matchedCases
  };
};
