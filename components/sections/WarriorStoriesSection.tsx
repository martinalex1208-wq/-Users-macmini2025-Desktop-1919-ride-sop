"use client";

import { BookOpen, Quote } from "lucide-react";
import HomeButton from "@/components/HomeButton";

const STORIES = [
  {
    name: "劉光起",
    declaration: "騎車不只是運動，是帶著使命去遇見需要幫助的人。每一次的停留，都是生命的交會。",
    detail:
      "從企業主管到環台勇士，劉光起將職場的執行力轉化為公益行動力，相信「做就對了」能改變世界。他參與過數次案家修繕，親手為弱勢家庭修補門窗、加固扶手，他說：「當你看到受助者眼中的感激，就知道這趟旅程值得。」劉光起用行動證明，公益不只是捐款，更是親身投入、陪伴與改變。",
  },
  {
    name: "吳丹鳳",
    declaration: "弱勢家庭需要的不是同情，而是陪伴。我們騎進去，把溫暖帶進去。",
    detail:
      "護理背景的吳丹鳳，用專業與同理心服務案家，她說：「修繕的不只是房子，更是他們對未來的盼望。」在食物包發放現場，她總是先坐下來聽案家講述生活困境，再遞上物資。她相信「先聽故事，再給物資」能讓關懷更有溫度。吳丹鳳用行動實踐低調服務與尊重隱私，讓每一位受助者都感受到被尊重的溫暖。",
  },
  {
    name: "周冠閎",
    declaration: "年輕人也可以做大事。騎 1300 公里很難，但幫助一個家庭走出困境，更值得。",
    detail:
      "最年輕的環台勇士之一，周冠閎用行動證明，公益沒有年齡限制，熱情與堅持就能創造影響。他從大學時期就參與 1919 愛走動，從志工到騎完全程，他說：「年輕人不是只能做小事，而是要用行動證明我們能改變世界。」周冠閎的故事激勵更多年輕人加入公益騎行，讓愛走動成為跨世代的使命。",
  },
];

export default function WarriorStoriesSection() {
  return (
    <section id="stories" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <BookOpen className="text-amber-500" size={24} />
              勇士生命故事
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              劉光起、吳丹鳳、周冠閎 · 他們的生命宣言見證愛走動的力量
            </p>
          </div>
          <HomeButton />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map(({ name, declaration, detail }, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700">
                  {name[0]}
                </div>
                <h3 className="font-bold text-slate-800">{name}</h3>
              </div>
              <blockquote className="mt-4 flex gap-2">
                <Quote className="shrink-0 text-amber-400" size={18} />
                <p className="text-sm font-medium italic text-slate-700">{declaration}</p>
              </blockquote>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
