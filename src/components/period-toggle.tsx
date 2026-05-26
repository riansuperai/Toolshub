"use client";

export type Period = "today" | "week" | "month" | "year";

const labels: Record<Period, string> = {
  today: "Vandaag",
  week: "Wekelijks",
  month: "Maandelijks",
  year: "Jaarlijks"
};

export function PeriodToggle({
  value,
  onChange,
  options = ["today", "week", "month", "year"]
}: {
  value: Period;
  onChange: (period: Period) => void;
  options?: Period[];
}) {
  return (
    <div className="seller-period-toggle" role="tablist">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={value === option}
          className={value === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
