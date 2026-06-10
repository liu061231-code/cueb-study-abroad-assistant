import { BadgeCheck, ExternalLink, GraduationCap, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult, ApplicantProfile, OfferCase, SchoolRecommendation } from "../types/application";

interface ResultPanelProps {
  profile: ApplicantProfile;
  result: AnalysisResult;
  cases: OfferCase[];
  isEmpty: boolean;
}

const groups = [
  { key: "stretchSchools", title: "冲刺", hint: "值得尝试，但需要材料突出", color: "text-cueb-red" },
  { key: "matchSchools", title: "匹配", hint: "背景相似度高，建议优先申请", color: "text-cueb-navy" },
  { key: "safetySchools", title: "保底", hint: "用于稳住录取结果", color: "text-emerald-700" }
] as const;

function SchoolCard({ item }: { item: SchoolRecommendation }) {
  const hasWebsite = Boolean(item.school.officialWebsite);
  const linkUrl = item.school.admissionsUrl || item.school.officialWebsite;

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

export function ResultPanel({ profile, result, cases, isEmpty }: ResultPanelProps) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestDeepSeekAnalysis = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch("/api/deepseek-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          recommendations: collectRecommendedSchools(result),
          cases: cases.slice(0, 35)
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "AI 分析请求失败");
      }

      setAnalysis(payload.analysis || "");
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
            <h3 className="text-lg font-black text-cueb-navy">AI 留学分析助手</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              基于你的背景、当前推荐结果和本地案例库分析，不编造录取案例。
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cueb-navy px-4 py-3 text-sm font-black text-white transition hover:bg-cueb-red disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={requestDeepSeekAnalysis}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "分析中..." : "让 AI 深度分析"}
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
            当前 GitHub Pages 是静态托管，DeepSeek API Key 不能安全保存在这里。迁移到 Vercel 并配置
            DEEPSEEK_API_KEY 后，此按钮会调用 /api/deepseek-analysis。
          </div>
        )}
      </div>
    </section>
  );
}
