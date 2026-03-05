import type { ClassTypeFilter } from "../../types/facility";

interface Props {
  value: ClassTypeFilter;
  onChange: (v: ClassTypeFilter) => void;
}

const OPTIONS: ClassTypeFilter[] = ["All", "A", "B", "C"];

export function ClassTypeToggle({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
        Class Type
      </label>
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
              value === opt
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
