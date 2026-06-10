import type { ChangeEvent } from "react";
import { Wand2 } from "lucide-react";
import {
  budgetRanges,
  cuebMajors,
  languageExamOptions,
  regionOptions,
  targetDirections
} from "../data/formOptions";
import type { ApplicantProfile, Region } from "../types/application";

interface ProfileFormProps {
  profile: ApplicantProfile;
  onChange: (profile: ApplicantProfile) => void;
  onAnalyze: () => void;
}

export function ProfileForm({ profile, onChange, onAnalyze }: ProfileFormProps) {
  const [currentExam, currentScore = "暂无"] = profile.languageScore.includes(" ")
    ? profile.languageScore.split(" ")
    : [profile.languageScore.replace(/[0-9.].*$/, "") || "雅思", profile.languageScore.replace(/^[^\d暂无]+/, "") || "暂无"];
  const selectedExam = languageExamOptions.find((item) => item.type === currentExam) ?? languageExamOptions[0];

  const update = (field: keyof ApplicantProfile, value: string | number) => {
    onChange({ ...profile, [field]: value });
  };

  const toggleRegion = (region: Region) => {
    const exists = profile.targetRegions.includes(region);
    const nextRegions = exists
      ? profile.targetRegions.filter((item) => item !== region)
      : [...profile.targetRegions, region];
    onChange({ ...profile, targetRegions: nextRegions.length > 0 ? nextRegions : [region] });
  };

  const updateLanguage = (exam: string, score: string) => {
    update("languageScore", score === "暂无" ? `${exam} 暂无` : `${exam} ${score}`);
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
          <select className="field" value={profile.major} onChange={handleText("major")}>
            {cuebMajors.map((major) => (
              <option key={major}>{major}</option>
            ))}
          </select>
          <p className="mt-1 text-xs leading-5 text-slate-400">专业清单参考首经贸当前本科专业与招生专业，最终以学校当年招生计划为准。</p>
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
            <select className="field" value={profile.budget} onChange={handleText("budget")}>
              {budgetRanges.map((range) => (
                <option key={range}>{range}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="form-label">语言考试</span>
            <select
              className="field"
              value={selectedExam.type}
              onChange={(event) => updateLanguage(event.target.value, "暂无")}
            >
              {languageExamOptions.map((exam) => (
                <option key={exam.type}>{exam.type}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="form-label">语言分数</span>
            <select
              className="field"
              value={selectedExam.scores.includes(currentScore) ? currentScore : "暂无"}
              onChange={(event) => updateLanguage(selectedExam.type, event.target.value)}
            >
              {selectedExam.scores.map((score) => (
                <option key={score}>{score}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-3">
          <div>
            <span className="form-label">目标国家 / 地区</span>
            <div className="grid grid-cols-2 gap-2">
              {regionOptions.map((item) => {
                const selected = profile.targetRegions.includes(item.region);
                return (
                  <button
                    key={item.region}
                    className={`region-pill ${selected ? "region-pill-selected" : ""}`}
                    type="button"
                    onClick={() => toggleRegion(item.region)}
                    aria-pressed={selected}
                  >
                    <span className="text-base">{item.flag}</span>
                    <span>{item.region}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-400">可多选，想申请哪个国家/地区就点哪个。</p>
          </div>
          <label className="block">
            <span className="form-label">目标专业</span>
            <select className="field" value={profile.direction} onChange={handleText("direction")}>
              {targetDirections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <p className="mt-1 text-xs leading-5 text-slate-400">数据不足，暂未呈现其他专业。</p>
          </label>
        </div>
        <label className="block">
          <span className="form-label">实习经历</span>
          <textarea
            className="field min-h-20 resize-y"
            value={profile.internships}
            onChange={handleText("internships")}
            placeholder="这里可自行填写：四大、券商、银行、咨询、互联网、数据分析、校内实践等"
          />
        </label>
        <label className="block">
          <span className="form-label">科研 / 学术成果</span>
          <textarea
            className="field min-h-20 resize-y"
            value={profile.research}
            onChange={handleText("research")}
            placeholder="这里可自行填写：大创、论文、商赛、课程项目、Python/SQL作品、科研助理经历等"
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
