import { BadgeCheck, GraduationCap, Target } from "lucide-react";
import type { AnalysisResult, SchoolRecommendation } from "../types/application";

interface ResultPanelProps {
  result: AnalysisResult;
  isEmpty: boolean;
}

const groups = [
  { key: "stretchSchools", title: "冲刺", hint: "值得尝试，但需要材料突出", color: "text-cueb-red" },
  { key: "matchSchools", title: "匹配", hint: "背景相似度高，建议优先申请", color: "text-cueb-navy" },
  { key: "safetySchools", title: "保底", hint: "用于稳住录取结果", color: "text-emerald-700" }
] as const;

function SchoolCard({ item }: { item: SchoolRecommendation }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-line">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-black text-cueb-navy">{item.school}</h4>
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
    </article>
  );
}

export function ResultPanel({ result, isEmpty }: ResultPanelProps) {
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
                <SchoolCard key={`${group.key}-${item.school}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
