import { BadgeCheck, ExternalLink, GraduationCap, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult, ApplicantProfile, OfferCase, SchoolRecommendation } from "../types/application";

interface ResultPanelProps {
  profile: ApplicantProfile;
  result: AnalysisResult;
  cases: OfferCase[];
  isEmpty: boolean;
}

const enableDeepSeek = import.meta.env.VITE_ENABLE_DEEPSEEK === "true";

const groups = [
  { key: "stretchSchools", title: "冲刺", hint: "值得尝试，但需要材料突出", color: "text-cueb-red" },
  { key: "matchSchools", title: "匹配", hint: "背景相似度高，建议优先申请", color: "text-cueb-navy" },
  { key: "safetySchools", title: "保底", hint: "用于稳住录取结果", color: "text-emerald-700" }
] as const;

function SchoolCard({ item }: { item: SchoolRecommendation }) {
  const hasWebsite = Boolean(item.school.officialWebsite);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-line">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-black text-cueb-navy">{item.school.nameZh}</h4>
          <p className="mt-1 text-sm font-bold text-slate-700">{item.school.nameEn}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{item.region}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
          {item.successRate}%
        </span>
      </div>
      <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-cueb-navy">
        {item.programs[0]}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{item.reasons[0]}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {hasWebsite ? (
          <>
            <a
              className="school-link-button"
              href={item.school.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              访问官网
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {item.school.admissionsUrl ? (
              <a
                className="school-link-button-secondary"
                href={item.school.admissionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                项目/招生链接
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-500">官网待补充</span>
        )}
      </div>
    </article>
  );
}

function collectRecommendedSchools(result: AnalysisResult) {
  return {
    stretchSchools: result.stretchSchools,
    matchSchools: result.matchSchools,
    safetySchools: result.safetySchools
  };
}

function formatSchoolList(items: SchoolRecommendation[]) {
  return items.map((item) => `${item.school.nameZh}（${item.successRate}%）`).join("、");
}

function createLocalAnalysis(profile: ApplicantProfile, result: AnalysisResult, cases: OfferCase[]) {
  const caseLine =
    cases.length > 0
      ? `当前案例库已纳入 ${cases.length} 条本地样本，本次匹配到 ${result.matchedCases.length} 条相关案例。`
      : "案例库暂无对应样本";

  return [
    "当前背景优势",
    `- GPA ${profile.gpa}、语言成绩 ${profile.languageScore || "暂未填写"}，可作为初步筛选依据。`,
    `- 目标地区为 ${profile.targetRegions.join("、")}，方向为 ${profile.direction}，系统已按地区和方向生成三档学校。`,
    `- ${caseLine}`,
    "",
    "当前短板",
    `- ${result.missingMaterials.length > 0 ? result.missingMaterials.join("；") : "暂未发现明显缺失项，但仍建议完善简历、文书和课程匹配说明。"}`,
    "- 本地规则报告不等同于最终录取判断，需要结合项目官网要求和人工顾问复核。",
    "",
    "冲刺校风险",
    `- 冲刺校包括：${formatSchoolList(result.stretchSchools)}。这些项目建议重点强化文书、实习含金量和课程匹配。`,
    "",
    "匹配校建议",
    `- 匹配校包括：${formatSchoolList(result.matchSchools)}。建议作为主申请组合，优先确认项目先修课、语言小分和申请轮次。`,
    "",
    "保底校建议",
    `- 保底校包括：${formatSchoolList(result.safetySchools)}。建议保留 2-3 个项目，用来控制整体申请风险。`,
    "",
    "申请材料提升方向",
    "- 简历突出首经贸专业课程、量化成绩、实习产出和项目成果。",
    "- 文书重点解释为什么选择该地区、该专业，以及本科背景如何支撑目标方向。",
    "- 如果申请金融、商业分析或数据科学，建议补充 Python、SQL、统计或金融建模相关材料。",
    "",
    "时间规划",
    ...result.timeline.map((item) => `- ${item}`)
  ].join("\n");
}

async function parseAnalysisResponse(response: Response) {
  const raw = await response.text();
  let payload: { analysis?: string; error?: string } | null = null;

  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    const shortText = raw.slice(0, 160).replace(/\s+/g, " ");
    throw new Error(`AI 服务返回了非 JSON 响应：${shortText || response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(payload?.error || `AI 服务请求失败：${response.status}`);
  }

  return payload?.analysis || "";
}

export function ResultPanel({ profile, result, cases, isEmpty }: ResultPanelProps) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestAnalysis = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      if (!enableDeepSeek) {
        setAnalysis(createLocalAnalysis(profile, result, cases));
        return;
      }

      const response = await fetch("/api/deepseek-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          recommendations: collectRecommendedSchools(result),
          cases: cases.slice(0, 35)
        })
      });

      setAnalysis(await parseAnalysisResponse(response));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "AI 分析请求失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-line">
        <div className="max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cueb-mist text-cueb-navy">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-cueb-navy">等待生成选校结果</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            填完左侧学业背景后，点击“生成可去学校”，这里会展示冲刺、匹配、保底三档学校。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cueb-navy text-white">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cueb-red">Step 2</p>
          <h2 className="mt-1 text-2xl font-black text-cueb-navy">可去学校</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{result.summary}</p>
        </div>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.key} className="rounded-[24px] bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className={`text-lg font-black ${group.color}`}>{group.title}学校</h3>
                <p className="mt-1 text-xs text-slate-500">{group.hint}</p>
              </div>
              <BadgeCheck className={`h-5 w-5 ${group.color}`} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {result[group.key].map((item) => (
                <SchoolCard key={`${group.key}-${item.school.id}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-cueb-navy">
              {enableDeepSeek ? "DeepSeek 留学分析助手" : "本地选校分析报告"}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {enableDeepSeek
                ? "基于你的背景、当前推荐结果和本地案例库分析，不编造录取案例。"
                : "无 AI 静态版使用本地规则生成报告，不需要 API Key，也不依赖后端。"}
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cueb-navy px-4 py-3 text-sm font-black text-white transition hover:bg-cueb-red disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={requestAnalysis}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "分析中..." : enableDeepSeek ? "让 DeepSeek 深度分析" : "生成本地分析报告"}
          </button>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-cueb-red">
            {error}
          </div>
        ) : null}
        {analysis ? (
          <div className="mt-4 whitespace-pre-line rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
            {analysis}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
            {enableDeepSeek
              ? "Vercel 版会通过 /api/deepseek-analysis 调用 DeepSeek，API Key 只保存在后端环境变量中。"
              : "当前是无 AI 静态版，点击按钮会用本地规则生成分析报告。"}
          </div>
        )}
      </div>
    </section>
  );
}
