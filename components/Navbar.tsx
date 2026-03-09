"use client";

import Link from "next/link";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/safety", label: "安全規範" },
  { href: "/sop", label: "SOP 手冊" },
  { href: "/repair", label: "案家修繕" },
  { href: "/inventory", label: "物資管理" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-amber-200 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-h-14 flex-wrap items-center justify-end gap-2 py-2 sm:gap-4 sm:py-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-700 sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
