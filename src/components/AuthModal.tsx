import { X } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function AuthModal({ open, onClose, onContinue }: AuthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cueb-navy/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[30px] bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-cueb-navy">登录 / 注册</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">后期用于保存选校报告，现在可直接跳过。</p>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-cueb-red"
            type="button"
            onClick={onClose}
            aria-label="关闭登录"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <input className="field" placeholder="手机号 / 邮箱" />
          <input className="field" placeholder="验证码 / 密码" />
        </div>
        <button
          className="mt-5 w-full rounded-2xl bg-cueb-navy px-5 py-3 font-black text-white transition hover:bg-cueb-red"
          type="button"
          onClick={onContinue}
        >
          继续进入
        </button>
        <button
          className="mt-3 w-full rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-600 transition hover:border-cueb-red hover:text-cueb-red"
          type="button"
          onClick={onClose}
        >
          暂时跳过
        </button>
      </div>
    </div>
  );
}
