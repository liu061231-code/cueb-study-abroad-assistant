import { ChangeEvent } from "react";
import type { ApplicantProfile, Direction, Region } from "../types/application";

const regions: Region[] = ["英国", "香港", "新加坡", "澳大利亚", "美国", "多国混申"];
const directions: Direction[] = ["金融", "会计", "商业分析", "管理", "经济", "数据科学"];

interface ProfileFormProps {
  profile: ApplicantProfile;
  onChange: (profile: ApplicantProfile) => void;
  onAnalyze: () => void;
}

export function ProfileForm({ profile, onChange, onAnalyze }: ProfileFormProps) {
  const update = (field: keyof ApplicantProfile, value: string | number) => {
    onChange({ ...profile, [field]: value });
  };

  const handleText =
    (field: keyof ApplicantProfile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      update(field, event.target.value);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-cueb-navy">背景信息录入</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          填得越具体，规则系统越能对齐首经贸案例库中的相似背景。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">本科专业</span>
          <input
            className="field"
            value={profile.major}
            onChange={handleText("major")}
            placeholder="如：会计学 / 金融学 / 经济学"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">GPA</span>
          <input
            className="field"
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={profile.gpa}
            onChange={(event) => update("gpa", Number(event.target.value))}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">语言成绩</span>
          <input
            className="field"
            value={profile.languageScore}
            onChange={handleText("languageScore")}
            placeholder="如：雅思7.0 / 托福100 / 暂无"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">预算</span>
          <input
            className="field"
            value={profile.budget}
            onChange={handleText("budget")}
            placeholder="如：50-80万"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">目标地区</span>
          <select
            className="field"
            value={profile.targetRegion}
            onChange={handleText("targetRegion")}
          >
            {regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">目标方向</span>
          <select className="field" value={profile.direction} onChange={handleText("direction")}>
            {directions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">实习经历</span>
          <textarea
            className="field min-h-24 resize-y"
            value={profile.internships}
            onChange={handleText("internships")}
            placeholder="如：四大审计、券商行研、银行、咨询、互联网数据分析等"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">科研/竞赛经历</span>
          <textarea
            className="field min-h-24 resize-y"
            value={profile.research}
            onChange={handleText("research")}
            placeholder="如：大创、数学建模、课程论文、Python/SQL 项目、作品集"
          />
        </label>
      </div>

      <button
        className="mt-6 w-full rounded-2xl bg-cueb-navy px-5 py-3.5 text-base font-black text-white transition hover:bg-cueb-red"
        type="button"
        onClick={onAnalyze}
      >
        生成选校分析报告
      </button>
    </section>
  );
}
