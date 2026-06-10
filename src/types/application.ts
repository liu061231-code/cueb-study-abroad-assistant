export type Region =
  | "英国"
  | "香港"
  | "新加坡"
  | "澳大利亚"
  | "美国"
  | "日本"
  | "韩国"
  | "加拿大"
  | "法国"
  | "德国"
  | "荷兰"
  | "瑞士";

export type Direction =
  | "金融"
  | "会计"
  | "商业分析"
  | "管理"
  | "经济"
  | "数据科学";

export interface ApplicantProfile {
  major: string;
  gpa: number;
  languageScore: string;
  targetRegions: Region[];
  budget: string;
  internships: string;
  research: string;
  direction: Direction;
}

export interface SchoolInfo {
  id: string;
  nameZh: string;
  nameEn: string;
  country: Region | string;
  officialWebsite: string;
  admissionsUrl?: string;
  tags: string[];
}

export interface OfferCase {
  id: number;
  studentTag: string;
  undergraduateMajor: string;
  gpa: number;
  gpaDisplay?: string;
  language: string;
  region: Region;
  direction: Direction;
  school: string;
  program: string;
  tier: "冲刺" | "匹配" | "保底";
  background: string;
  year: number;
  pathway?: "普通本科" | "需核验";
  sourceType?: "公开案例" | "模拟补充";
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface SchoolRecommendation {
  school: SchoolInfo;
  programs: string[];
  region: string;
  successRate: number;
  reasons: string[];
  relatedCases: OfferCase[];
}

export interface AnalysisResult {
  summary: string;
  stretchSchools: SchoolRecommendation[];
  matchSchools: SchoolRecommendation[];
  safetySchools: SchoolRecommendation[];
  missingMaterials: string[];
  timeline: string[];
  matchedCases: OfferCase[];
}
