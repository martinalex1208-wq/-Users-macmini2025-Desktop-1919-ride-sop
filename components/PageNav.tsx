"use client";

import {
  LayoutDashboard,
  Target,
  Crown,
  Scale,
  Shield,
  Users,
  Package,
  BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "vision", label: "核心願景", icon: Target },
  { id: "board", label: "環台行程表", icon: LayoutDashboard },
  { id: "ceo", label: "CEO 專案", icon: Crown },
  { id: "discipline", label: "紀律管理", icon: Scale },
  { id: "safety", label: "安全規範", icon: Shield },
  { id: "tlzone", label: "小組長專區", icon: Users },
  { id: "equipment", label: "裝備檢核表", icon: Package },
  { id: "stories", label: "勇士故事", icon: BookOpen },
] as const;

export default function PageNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        快速導覽
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => scrollTo(id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-700"
            >
              <Icon size={18} className="text-amber-500 shrink-0" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
