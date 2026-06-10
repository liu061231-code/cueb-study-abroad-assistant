import { BarChart3, CalendarDays, FilePlus2, Target } from "lucide-react";
import type { AnalysisResult, SchoolRecommendation } from "../types/application";

interface ResultPanelProps {
  result: AnalysisResult;
}

const tierConfig = [
  { key: "stretchSchools", title: "冲刺校", color: "text-cueb-red", border: "border-red-100" },
  { key: "matchSchools", title: "匹配校", color: "text-cueb-navy", border: "border-blue-100" },
  { key: "safetySchools", title: "保底校", color: "text-emerald-700", border: "border-emerald-100" }
] as const;

function RecommendationCard({
  item,
  accent
}: {
  item: SchoolRecommendation;
  accent: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-black text-cueb-navy">{item.school}</h4>
          <p className="mt-1 text-sm text-slate-500">{item.region}</p>
        </div>
        <div className={`rounded-2xl bg-slate-50 px-3 py-2 text-lg font-black ${accent}`}>
          {item.successRate}%
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.programs.map((program) => (
          <span key={program} className="rounded-full bg-cueb-mist px-3 py-1 text-xs font-bold text-cueb-navy">
            {program}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
        {item.reasons.map((reason) => (
          <li key={reason}>• {reason}</li>
        ))}
      </ul>
    </article>
  );
}

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-cueb-navy p-6 text-white shadow-soft sm:p-7">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <BarChart3 className="h-6 w-6 text-cueb-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-black">选校分析报告</h2>
            <p className="mt-1 text-sm text-slate-300">规则系统初筛结果，可作为咨询前的第一版方案</p>
          </div>
        </div>
        <p className="mt-5 text-base leading-8 text-slate-100">{result.summary}</p>
      </div>

      {tierConfig.map((config) => (
        <div key={config.key} className={`rounded-[32px] border ${config.border} bg-slate-50 p-5`}>
          <div className="mb-4 flex items-center gap-2">
            <Target className={`h-5 w-5 ${config.color}`} />
            <h3 className={`text-xl font-black ${config.color}`}>{config.title}</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {result[config.key].map((item) => (
              <RecommendationCard key={`${config.title}-${item.school}`} item={item} accent={config.color} />
            ))}
          </div>
        </div>
      ))}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-line">
          <div className="mb-4 flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-cueb-red" />
            <h3 className="text-xl font-black text-cueb-navy">还需要补充的材料</h3>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            {result.missingMaterials.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-line">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-cueb-gold" />
            <h3 className="text-xl font-black text-cueb-navy">时间规划</h3>
          </div>
          <ol className="space-y-3 text-sm leading-6 text-slate-600">
            {result.timeline.map((item, index) => (
              <li key={item} className="grid grid-cols-[32px_1fr] gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cueb-mist text-xs font-black text-cueb-navy">
                  {index + 1}
                </span>
                <span className="pt-1">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
