import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 1919 愛走動 | 單車環台官網",
  description: "帶著使命騎，為了生命停。1919 愛走動單車環台，1,300 公里 15 天，年度募款目標 NT$40,000,000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-slate-100 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
