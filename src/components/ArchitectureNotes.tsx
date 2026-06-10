import { Database, FileSpreadsheet, PlugZap } from "lucide-react";

const notes = [
  {
    icon: PlugZap,
    title: "OpenAI API 接入点",
    body: "在 src/lib/mockAi.ts 替换为服务端 API 调用，把表单画像、规则结果和相似案例传给模型生成解释、文书建议和追问。"
  },
  {
    icon: FileSpreadsheet,
    title: "真实 Excel 案例接入点",
    body: "将 src/data/offerCases.ts 替换为 Excel 导入任务，字段映射到 OfferCase 类型，再通过 API 或构建脚本写入数据库。"
  },
  {
    icon: Database,
    title: "数据库演进方向",
    body: "OfferCase、ApplicantProfile、AnalysisResult 可直接映射到 Supabase/Postgres，支持后台维护案例和用户分析记录。"
  }
];

export function ArchitectureNotes() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {notes.map((note) => {
        const Icon = note.icon;
        return (
          <article key={note.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-line">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cueb-mist text-cueb-navy">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-cueb-navy">{note.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{note.body}</p>
          </article>
        );
      })}
    </section>
  );
}
