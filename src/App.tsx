import { useMemo, useRef, useState } from "react";
import { ArchitectureNotes } from "./components/ArchitectureNotes";
import { CaseLibrary } from "./components/CaseLibrary";
import { ChatPreview } from "./components/ChatPreview";
import { ExamplePromptBar } from "./components/ExamplePromptBar";
import { Hero } from "./components/Hero";
import { ProfileForm } from "./components/ProfileForm";
import { ResultPanel } from "./components/ResultPanel";
import { offerCases } from "./data/offerCases";
import { buildMockAiReply } from "./lib/mockAi";
import { analyzeApplicant } from "./lib/recommendation";
import type { ApplicantProfile } from "./types/application";

const initialProfile: ApplicantProfile = {
  major: "会计学",
  gpa: 3.5,
  languageScore: "雅思7.0",
  targetRegion: "英国",
  budget: "50-80万",
  internships: "四大审计实习",
  research: "课程论文、商赛经历",
  direction: "金融"
};

export default function App() {
  const [profile, setProfile] = useState<ApplicantProfile>(initialProfile);
  const [prompt, setPrompt] = useState("GPA 3.5 会计专业");
  const [analysisVersion, setAnalysisVersion] = useState(0);
  const workbenchRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => analyzeApplicant(profile, offerCases), [profile, analysisVersion]);
  const reply = useMemo(() => buildMockAiReply(profile, result, prompt), [profile, result, prompt]);

  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExamplePrompt = (value: string) => {
    setPrompt(value);
    if (value.includes("会计")) {
      setProfile((current) => ({ ...current, major: "会计学", direction: "会计" }));
    }
    if (value.includes("英国")) {
      setProfile((current) => ({ ...current, targetRegion: "英国", budget: "50-80万" }));
    }
    if (value.includes("G5") || value.includes("金融")) {
      setProfile((current) => ({ ...current, direction: "金融" }));
    }
    if (value.includes("四大")) {
      setProfile((current) => ({ ...current, internships: "四大审计实习、财务分析项目" }));
    }
    if (value.includes("多国") || value.includes("英港新")) {
      setProfile((current) => ({ ...current, targetRegion: "多国混申" }));
    }
    if (value.includes("经济学")) {
      setProfile((current) => ({ ...current, major: "经济学", direction: "商业分析" }));
    }
    scrollToWorkbench();
  };

  return (
    <div className="min-h-screen bg-paper text-slate-900">
      <Hero onStart={scrollToWorkbench} />

      <main ref={workbenchRef} className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8 lg:px-10">
        <ExamplePromptBar onSelect={handleExamplePrompt} />

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <ProfileForm
              profile={profile}
              onChange={setProfile}
              onAnalyze={() => setAnalysisVersion((version) => version + 1)}
            />
            <ChatPreview
              prompt={prompt}
              reply={reply}
              onPromptChange={setPrompt}
              onSend={() => setAnalysisVersion((version) => version + 1)}
            />
          </div>
          <ResultPanel result={result} />
        </div>

        <CaseLibrary />
        <ArchitectureNotes />
      </main>
    </div>
  );
}
