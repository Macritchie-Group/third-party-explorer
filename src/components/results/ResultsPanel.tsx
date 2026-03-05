import type { Facility } from "../../types/facility";
import { ResultRow } from "./ResultRow";
import { exportCsv } from "../../lib/exportCsv";

interface Props {
  results: Facility[];
  onSelect: (f: Facility) => void;
}

export function ResultsPanel({ results, onSelect }: Props) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Results{" "}
          <span className="text-sm font-normal text-gray-500">
            ({results.length.toLocaleString()})
          </span>
        </h2>
        <button
          onClick={() => exportCsv(results, "filtered_facilities.csv")}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export CSV
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No results match your filters.
          </div>
        ) : (
          results.map((f) => (
            <ResultRow key={f.MasterID} facility={f} onClick={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}
