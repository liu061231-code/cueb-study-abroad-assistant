import { describe, expect, it } from "vitest";
import { offerCases } from "../data/offerCases";
import { analyzeApplicant } from "./recommendation";
import type { ApplicantProfile } from "../types/application";

const strongProfile: ApplicantProfile = {
  major: "会计学",
  gpa: 3.65,
  languageScore: "雅思7.0",
  targetRegions: ["英国"],
  budget: "50-80万",
  internships: "四大审计实习、券商行研实习",
  research: "大创项目、数学建模竞赛",
  direction: "金融"
};

describe("offer case data", () => {
  it("contains exactly 35 mock admission cases", () => {
    expect(offerCases).toHaveLength(35);
  });
});

describe("analyzeApplicant", () => {
  it("returns stretch, match and safety school groups with rates", () => {
    const result = analyzeApplicant(strongProfile, offerCases);

    expect(result.stretchSchools.length).toBeGreaterThan(0);
    expect(result.matchSchools.length).toBeGreaterThan(0);
    expect(result.safetySchools.length).toBeGreaterThan(0);
    expect(result.stretchSchools[0].successRate).toBeGreaterThanOrEqual(35);
    expect(result.matchSchools[0].successRate).toBeGreaterThanOrEqual(55);
    expect(result.safetySchools[0].successRate).toBeGreaterThanOrEqual(70);
  });

  it("prioritizes cases from the requested region and direction", () => {
    const result = analyzeApplicant(strongProfile, offerCases);
    const rankedRegions = result.matchedCases.slice(0, 6).map((item) => item.region);
    const rankedDirections = result.matchedCases.slice(0, 6).map((item) => item.direction);

    expect(rankedRegions).toContain("英国");
    expect(rankedDirections).toContain("金融");
  });

  it("suggests missing materials based on profile gaps", () => {
    const result = analyzeApplicant(
      {
        ...strongProfile,
        languageScore: "暂无",
        internships: "",
        research: ""
      },
      offerCases
    );

    expect(result.missingMaterials).toContain("补充雅思/托福/多邻国/PTE等标化成绩截图或考试计划");
    expect(result.missingMaterials).toContain("补充与目标专业相关的实习经历和职责成果");
    expect(result.missingMaterials).toContain("补充科研、竞赛、课程项目或数据分析作品");
  });
}
);
