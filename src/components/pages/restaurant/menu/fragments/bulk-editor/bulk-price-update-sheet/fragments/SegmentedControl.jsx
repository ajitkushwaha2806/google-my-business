import { cn } from "@/lib/utils";

export function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex w-full rounded-lg border border-input p-1 bg-white shadow-sm">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 flex items-center justify-center rounded-md h-8 text-[13px] font-semibold transition-all",
              isActive
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
