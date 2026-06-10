import { useMemo, useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { IntroCarousel } from "./components/IntroCarousel";
import { MoreDrawer } from "./components/MoreDrawer";
import { ProfileForm } from "./components/ProfileForm";
import { ResultPanel } from "./components/ResultPanel";
import { offerCases } from "./data/offerCases";
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
  const [analysisVersion, setAnalysisVersion] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const result = useMemo(() => analyzeApplicant(profile, offerCases), [profile, analysisVersion]);
  const hasGenerated = analysisVersion > 0;

  const finishIntro = () => {
    setShowIntro(false);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {showIntro ? <IntroCarousel onFinish={finishIntro} /> : null}

      {!showIntro ? (
        <main className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div>
                <h1 className="text-lg font-black text-cueb-navy sm:text-xl">首经贸留学助手</h1>
                <p className="text-xs font-medium text-slate-500">普通本科生海外硕士选校分析</p>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-black text-cueb-navy shadow-line transition hover:border-cueb-red hover:text-cueb-red"
                type="button"
                aria-label="打开更多功能"
                onClick={() => setDrawerOpen(true)}
              >
                ···
              </button>
            </div>
          </header>

          <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
            <ProfileForm
              profile={profile}
              onChange={setProfile}
              onAnalyze={() => setAnalysisVersion((version) => version + 1)}
            />
            <ResultPanel result={result} isEmpty={!hasGenerated} />
          </section>
        </main>
      ) : null}

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onContinue={() => setShowAuth(false)}
      />
      <MoreDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogin={() => {
          setDrawerOpen(false);
          setShowAuth(true);
        }}
        onIntro={() => {
          setDrawerOpen(false);
          setShowIntro(true);
        }}
      />
    </div>
  );
}
