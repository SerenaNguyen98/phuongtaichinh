"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const DAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export function Calendar({ selected, onChange, className }: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(selected || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isSelected = (day: number) =>
    selected &&
    day === selected.getDate() &&
    month === selected.getMonth() &&
    year === selected.getFullYear();

  const handleSelect = (day: number) => {
    const d = new Date(year, month, day);
    onChange?.(d);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className={cn("p-3 select-none", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-text-sub hover:text-text-main hover:bg-bg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-heading font-semibold text-text-main">
          {MONTHS_VI[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg text-text-sub hover:text-text-main hover:bg-bg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_EN.map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-[11px] font-semibold text-text-sub uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => (
          <div key={idx} className="h-8">
            {day !== null && (
              <button
                onClick={() => handleSelect(day)}
                className={cn(
                  "w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors",
                  isSelected(day)
                    ? "bg-primary text-white font-semibold"
                    : "text-text-main hover:bg-bg hover:text-primary"
                )}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
