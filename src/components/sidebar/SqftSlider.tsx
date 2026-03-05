interface Props {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

export function SqftSlider({ min, max, valueMin, valueMax, onChange }: Props) {
  const displayMax = valueMax === Infinity ? max : valueMax;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
        Total Sqft
      </label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">Min</span>
          <input
            type="range"
            min={min}
            max={max}
            value={valueMin}
            onChange={(e) => onChange(Number(e.target.value), valueMax)}
            className="flex-1"
          />
          <input
            type="number"
            value={valueMin}
            min={min}
            max={displayMax}
            onChange={(e) => {
              const v = Math.max(min, Math.min(Number(e.target.value) || 0, displayMax));
              onChange(v, valueMax);
            }}
            className="w-20 text-xs text-gray-700 text-right border border-gray-300 rounded px-1 py-0.5"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">Max</span>
          <input
            type="range"
            min={min}
            max={max}
            value={displayMax}
            onChange={(e) => onChange(valueMin, Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            value={displayMax}
            min={valueMin}
            max={max}
            onChange={(e) => {
              const v = Math.max(valueMin, Math.min(Number(e.target.value) || 0, max));
              onChange(valueMin, v);
            }}
            className="w-20 text-xs text-gray-700 text-right border border-gray-300 rounded px-1 py-0.5"
          />
        </div>
      </div>
    </div>
  );
}
