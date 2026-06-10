export type Region =
  | "英国"
  | "香港"
  | "新加坡"
  | "澳大利亚"
  | "美国"
  | "多国混申";

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
  targetRegion: Region;
  budget: string;
  internships: string;
  research: string;
  direction: Direction;
}

export interface OfferCase {
  id: number;
  studentTag: string;
  undergraduateMajor: string;
  gpa: number;
  gpaDisplay?: string;
  language: string;
  region: Exclude<Region, "多国混申">;
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
  school: string;
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
