import { ArrowRight, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <header className="relative overflow-hidden bg-cueb-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,148,47,0.28),transparent_30%),linear-gradient(135deg,rgba(180,35,24,0.35),transparent_40%)]" />
      <div className="relative mx-auto grid min-h-[620px] max-w-7xl grid-cols-1 gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        <nav className="col-span-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cueb-red">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-bold">首经贸留学助手</div>
              <div className="text-xs text-slate-300">CUEB Study Abroad AI</div>
            </div>
          </div>
          <button
            className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-cueb-navy transition hover:bg-cueb-gold hover:text-white sm:inline-flex"
            type="button"
            onClick={onStart}
          >
            开始分析
          </button>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            首经贸留学助手
          </h1>
          <p className="mt-5 text-xl font-semibold text-cueb-gold sm:text-2xl">
            AI 驱动 · 基于真实案例
          </p>
          <div className="mt-8 rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="text-2xl font-bold">你好，我是小留学长</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-100">
              基于首经贸普通本科学长学姐真实 Offer 公开案例，并用模拟补充样本扩展规则系统，
              我会把你的背景拆成专业、GPA、语言、实习、科研和预算维度，给出冲刺、匹配、保底选校组合。
            </p>
          </div>
          <button
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cueb-red px-6 py-3 text-base font-bold text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-700"
            type="button"
            onClick={onStart}
          >
            填写背景，生成选校方案
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-[36px] border border-white/15 bg-white p-5 text-cueb-navy shadow-soft">
          <div className="rounded-[28px] bg-slate-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">选校分析系统</div>
                <div className="mt-1 text-2xl font-black">案例驱动推荐</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-3 text-cueb-red">
                <BookOpenCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["冲刺校", "G5 / 港前三 / NUS 等高目标项目", "42%-58%"],
                ["匹配校", "背景贴合度高、案例相似度强", "62%-76%"],
                ["保底校", "申请节奏稳定，兜底结果确定性高", "78%-90%"]
              ].map(([title, desc, rate]) => (
                <div
                  key={title}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <ShieldCheck className="h-5 w-5 text-cueb-gold" />
                  <div>
                    <div className="font-bold">{title}</div>
                    <div className="text-sm text-slate-500">{desc}</div>
                  </div>
                  <div className="text-sm font-black text-cueb-red">{rate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
