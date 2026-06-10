import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, GraduationCap, Layers3 } from "lucide-react";
import { useState } from "react";

interface IntroCarouselProps {
  onFinish: () => void;
}

const slides = [
  {
    title: "专为首经贸普通本科生设计",
    subtitle: "不混淆国际本科、2+2、预科项目",
    body: "案例库聚焦高考进入首经贸的本科生，毕业后申请海外硕士的真实路径。",
    tone: "bg-cueb-navy text-white"
  },
  {
    title: "先看你的学业背景",
    subtitle: "专业、GPA、语言、地区、预算、经历",
    body: "你填写背景后，系统会把信息拆成可计算维度，与首经贸案例库做相似度匹配。",
    tone: "bg-white text-cueb-navy"
  },
  {
    title: "再生成三档选校",
    subtitle: "冲刺校 · 匹配校 · 保底校",
    body: "规则系统会给出可去学校、成功率估计、推荐理由、材料补充与时间规划。",
    tone: "bg-[#fff7ed] text-cueb-navy"
  }
];

function DemoPanel({ step }: { step: number }) {
  return (
    <div className="rounded-[30px] border border-white/30 bg-white p-4 text-cueb-navy shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-sm font-black">
        <Layers3 className="h-4 w-4 text-cueb-red" />
        选校分析 UI 演示
      </div>
      {step === 0 ? (
        <div className="space-y-3">
          {["高考统招本科", "会计学 / 金融学 / 经济学", "目标：英国 / 香港 / 多国混申"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      ) : null}
      {step === 1 ? (
        <div className="grid gap-3">
          {["GPA 3.5", "雅思 7.0", "四大审计实习", "预算 50-80万"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold">
              {item}
            </div>
          ))}
        </div>
      ) : null}
      {step === 2 ? (
        <div className="space-y-3">
          {[
            ["冲刺", "Imperial / UCL", "45%"],
            ["匹配", "Manchester / Bristol", "68%"],
            ["保底", "Glasgow / Leeds", "84%"]
          ].map(([tier, school, rate]) => (
            <div key={tier} className="grid grid-cols-[52px_1fr_48px] items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm">
              <span className="font-black text-cueb-red">{tier}</span>
              <span className="font-bold">{school}</span>
              <span className="text-right font-black text-emerald-700">{rate}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function IntroCarousel({ onFinish }: IntroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <section
      className={`flex min-h-screen items-center ${slide.tone}`}
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const delta = event.changedTouches[0].clientX - touchStart;
        if (delta < -50 && !isLast) setIndex((current) => current + 1);
        if (delta > 50 && index > 0) setIndex((current) => current - 1);
        setTouchStart(null);
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_420px] md:items-center">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-cueb-gold">
            <GraduationCap className="h-8 w-8" />
          </div>
          <p className="text-sm font-black uppercase tracking-wide opacity-70">首经贸留学助手</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{slide.title}</h1>
          <p className="mt-5 text-xl font-bold text-cueb-gold">{slide.subtitle}</p>
          <p className="mt-5 max-w-2xl text-base leading-8 opacity-80">{slide.body}</p>
          <div className="mt-9 flex items-center gap-3">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 disabled:opacity-30"
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              aria-label="上一页"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {slides.map((item, itemIndex) => (
                <span
                  key={item.title}
                  className={`h-2 rounded-full transition-all ${
                    itemIndex === index ? "w-8 bg-cueb-red" : "w-2 bg-current/25"
                  }`}
                />
              ))}
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-cueb-red px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-950/20"
              type="button"
              onClick={() => (isLast ? onFinish() : setIndex((current) => current + 1))}
            >
              {isLast ? "进入选校" : "下一页"}
              {isLast ? <ChevronRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-5 text-xs opacity-60">手机端可左右滑动，下方按钮也可翻页。</p>
        </div>
        <DemoPanel step={index} />
      </div>
    </section>
  );
}
