import type { ChangeEvent } from "react";
import { Wand2 } from "lucide-react";
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
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-wide text-cueb-red">Step 1</p>
        <h2 className="mt-1 text-2xl font-black text-cueb-navy">填写学业背景</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">只填核心信息，系统会直接生成可去学校。</p>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="form-label">本科专业</span>
          <input className="field" value={profile.major} onChange={handleText("major")} placeholder="会计学" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="form-label">GPA</span>
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
          <label className="block">
            <span className="form-label">预算</span>
            <input className="field" value={profile.budget} onChange={handleText("budget")} placeholder="50-80万" />
          </label>
        </div>
        <label className="block">
          <span className="form-label">语言成绩</span>
          <input className="field" value={profile.languageScore} onChange={handleText("languageScore")} placeholder="雅思7.0" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="form-label">目标地区</span>
            <select className="field" value={profile.targetRegion} onChange={handleText("targetRegion")}>
              {regions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="form-label">目标方向</span>
            <select className="field" value={profile.direction} onChange={handleText("direction")}>
              {directions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="form-label">实习经历</span>
          <textarea
            className="field min-h-20 resize-y"
            value={profile.internships}
            onChange={handleText("internships")}
            placeholder="四大、券商、银行、咨询、数据分析等"
          />
        </label>
        <label className="block">
          <span className="form-label">科研 / 竞赛</span>
          <textarea
            className="field min-h-20 resize-y"
            value={profile.research}
            onChange={handleText("research")}
            placeholder="大创、商赛、课程论文、Python/SQL 项目"
          />
        </label>
      </div>

      <button
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cueb-red px-5 py-3.5 font-black text-white shadow-lg shadow-red-950/10 transition hover:bg-red-700"
        type="button"
        onClick={onAnalyze}
      >
        <Wand2 className="h-5 w-5" />
        生成可去学校
      </button>
    </section>
  );
}
