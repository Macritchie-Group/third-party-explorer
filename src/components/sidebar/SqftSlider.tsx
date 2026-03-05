interface Props {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

export function SqftSlider({ min, max, valueMin, valueMax, onChange }: Props) {
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
          <span className="text-xs text-gray-700 w-16 text-right">
            {valueMin.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">Max</span>
          <input
            type="range"
            min={min}
            max={max}
            value={valueMax === Infinity ? max : valueMax}
            onChange={(e) => onChange(valueMin, Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-700 w-16 text-right">
            {valueMax === Infinity ? max.toLocaleString() : valueMax.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
