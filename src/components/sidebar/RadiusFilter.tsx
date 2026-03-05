interface Props {
  value: number | null;
  onChange: (miles: number | null) => void;
}

const PRESETS = [null, 5, 10, 25, 50, 100] as const;

export function RadiusFilter({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
        Radius from Owned
      </label>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((miles) => (
          <button
            key={String(miles)}
            onClick={() => onChange(miles)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              value === miles
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {miles === null ? "Off" : `${miles} mi`}
          </button>
        ))}
      </div>
    </div>
  );
}
