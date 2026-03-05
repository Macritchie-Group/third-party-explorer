import type { CompanyTypeFilter as CompanyType } from "../../types/facility";

interface Props {
  selected: Set<CompanyType>;
  onToggle: (type: CompanyType) => void;
}

export function CompanyTypeFilter({ selected, onToggle }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
        Company Type
      </label>
      <div className="space-y-1">
        {(["Multi-Op", "Single-Op"] as CompanyType[]).map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.has(type)}
              onChange={() => onToggle(type)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full mr-1"
                style={{
                  backgroundColor:
                    type === "Multi-Op" ? "#DC2626" : "#6B7280",
                }}
              />
              {type}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
