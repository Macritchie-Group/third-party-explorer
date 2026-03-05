import type { Facility } from "../../types/facility";

interface Props {
  facility: Facility;
  onClick: (f: Facility) => void;
}

export function ResultRow({ facility: f, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(f)}
      className="w-full text-left px-3 py-2.5 border-b border-gray-100 hover:bg-blue-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">
            {f.StoreName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {f.City}, {f.State} {f.ZipCode}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div
            className="text-xs font-medium"
            style={{
              color: f.CompanyType === "Multi-Op" ? "#DC2626" : "#6B7280",
            }}
          >
            {f.CompanyType}
          </div>
          <div className="text-xs text-gray-400">
            {f.TotalSqft.toLocaleString()} sqft
          </div>
        </div>
      </div>
    </button>
  );
}
