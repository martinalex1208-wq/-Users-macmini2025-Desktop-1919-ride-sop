"use client";

import { DaySelectionProvider } from "@/contexts/DaySelectionContext";

export default function RouteContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DaySelectionProvider>{children}</DaySelectionProvider>;
}
