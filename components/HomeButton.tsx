"use client";

import { Home } from "lucide-react";

export default function HomeButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 active:scale-95 sm:h-11 sm:w-11 sm:rounded-lg sm:border-0 sm:bg-amber-100 sm:shadow-none"
      aria-label="返回頁首"
      title="返回頁首"
    >
      <Home size={22} className="text-amber-600" />
    </button>
  );
}
