"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface DaySelectionContextValue {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const DaySelectionContext = createContext<DaySelectionContextValue | null>(null);

export function DaySelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedDay, setSelectedDay] = useState(1);
  return (
    <DaySelectionContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </DaySelectionContext.Provider>
  );
}

export function useDaySelection() {
  const ctx = useContext(DaySelectionContext);
  if (!ctx) throw new Error("useDaySelection must be used within DaySelectionProvider");
  return ctx;
}
