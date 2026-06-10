import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { offerCases } from "../data/offerCases";

export function CaseLibrary() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("全部");

  const filtered = useMemo(() => {
    return offerCases.filter((item) => {
      const content = `${item.school}${item.program}${item.undergraduateMajor}${item.direction}${item.background}`;
      const matchesQuery = query.trim() ? content.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesRegion = region === "全部" ? true : item.region === region;
      return matchesQuery && matchesRegion;
    });
  }, [query, region]);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-cueb-navy">首经贸案例库</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            聚焦高考进入首经贸的普通本科生毕业后申请海外硕士，不纳入国际本科/2+2/预科项目路径。
            当前共 35 条，公开案例优先展示，模拟补充样本用于规则系统占位。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="field w-full pl-9 sm:w-64"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索学校/专业/背景"
            />
          </label>
          <select className="field sm:w-36" value={region} onChange={(event) => setRegion(event.target.value)}>
            {["全部", "英国", "香港", "新加坡", "澳大利亚", "美国"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <div className="hidden grid-cols-[1.1fr_1fr_0.9fr_1.5fr] bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 md:grid">
          <span>录取项目</span>
          <span>背景</span>
          <span>标签</span>
          <span>案例亮点</span>
        </div>
        <div className="max-h-[560px] divide-y divide-slate-100 overflow-auto">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.1fr_1fr_0.9fr_1.5fr] md:items-center"
            >
              <div>
                <div className="font-black text-cueb-navy">{item.school}</div>
                <div className="mt-1 text-slate-500">{item.program}</div>
              </div>
              <div className="text-slate-600">
                {item.undergraduateMajor} · {item.gpaDisplay ?? `GPA ${item.gpa.toFixed(2)}`} · {item.language}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-cueb-red">{item.region}</span>
                <span className="rounded-full bg-cueb-mist px-2 py-1 text-xs font-bold text-cueb-navy">{item.tier}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                  {item.pathway ?? "普通本科"}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                  {item.sourceType ?? "模拟补充"}
                </span>
              </div>
              <div className="text-slate-600">
                {item.background}
                {item.sourceUrl ? (
                  <a
                    className="ml-2 font-bold text-cueb-red underline-offset-4 hover:underline"
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    来源
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
