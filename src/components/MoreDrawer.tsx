import { BookOpen, LogIn, PlusCircle, X } from "lucide-react";

interface MoreDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onIntro: () => void;
}

export function MoreDrawer({ open, onClose, onLogin, onIntro }: MoreDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-cueb-navy/30 transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[320px] max-w-[86vw] bg-white p-5 shadow-soft transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-cueb-navy">更多</h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            type="button"
            onClick={onClose}
            aria-label="关闭更多"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <button className="drawer-action" type="button" onClick={onLogin}>
            <LogIn className="h-5 w-5 text-cueb-red" />
            <span>登录 / 注册</span>
          </button>
          <button className="drawer-action" type="button" onClick={onIntro}>
            <BookOpen className="h-5 w-5 text-cueb-gold" />
            <span>查看介绍</span>
          </button>
          <button className="drawer-action" type="button" onClick={onClose}>
            <PlusCircle className="h-5 w-5 text-emerald-700" />
            <span>新增案例</span>
          </button>
        </div>
        <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          新增案例入口暂未接后台，后期可接入 Excel 导入或案例库管理系统。
        </p>
      </aside>
    </>
  );
}
