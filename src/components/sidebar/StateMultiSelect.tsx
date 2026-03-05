import { useState } from "react";

interface Props {
  available: string[];
  selected: Set<string>;
  onChange: (states: Set<string>) => void;
}

export function StateMultiSelect({ available, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function toggle(state: string) {
    const next = new Set(selected);
    if (next.has(state)) next.delete(state);
    else next.add(state);
    onChange(next);
  }

  function clearAll() {
    onChange(new Set());
  }

  const label =
    selected.size === 0
      ? "All States"
      : selected.size <= 3
        ? Array.from(selected).sort().join(", ")
        : `${selected.size} states`;

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
        State
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 flex justify-between items-center"
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-3 py-1.5">
            <button
              onClick={clearAll}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>
          {available.map((state) => (
            <label
              key={state}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(state)}
                onChange={() => toggle(state)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{state}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
