import { Bot, SendHorizontal } from "lucide-react";

interface ChatPreviewProps {
  prompt: string;
  reply: string;
  onPromptChange: (value: string) => void;
  onSend: () => void;
}

export function ChatPreview({ prompt, reply, onPromptChange, onSend }: ChatPreviewProps) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-cueb-mist p-3 text-cueb-navy">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-cueb-navy">小留学长 AI 回复模拟</h2>
          <p className="mt-1 text-sm text-slate-500">第一阶段保留聊天入口，当前用 mock 数据模拟回复。</p>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="mb-4 max-w-[86%] rounded-3xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-line">
          {prompt || "GPA 3.5 会计专业，想去英国，预算50-80万"}
        </div>
        <div className="ml-auto max-w-[92%] whitespace-pre-line rounded-3xl bg-cueb-navy p-4 text-sm leading-7 text-white">
          {reply}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="field"
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="输入你的问题，例如：金融学冲G5"
        />
        <button
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cueb-red text-white transition hover:bg-red-700"
          type="button"
          onClick={onSend}
          aria-label="发送问题"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
