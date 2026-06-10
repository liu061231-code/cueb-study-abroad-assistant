import { Sparkles } from "lucide-react";
import { examplePrompts } from "../data/examplePrompts";

interface ExamplePromptBarProps {
  onSelect: (prompt: string) => void;
}

export function ExamplePromptBar({ onSelect }: ExamplePromptBarProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cueb-navy">
        <Sparkles className="h-4 w-4 text-cueb-gold" />
        你可以这样问小留学长
      </div>
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cueb-red hover:bg-red-50 hover:text-cueb-red"
            type="button"
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
