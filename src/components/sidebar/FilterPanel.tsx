import type {
  ClassTypeFilter,
  CompanyTypeFilter as CompanyType,
  FilterState,
} from "../../types/facility";
import { CompanyTypeFilter } from "./CompanyTypeFilter";
import { ClassTypeToggle } from "./ClassTypeToggle";
import { SqftSlider } from "./SqftSlider";
import { StateMultiSelect } from "./StateMultiSelect";
import { RadiusFilter } from "./RadiusFilter";

interface Props {
  filters: FilterState;
  availableStates: string[];
  sqftRange: { min: number; max: number };
  onToggleCompanyType: (type: CompanyType) => void;
  onSetClassType: (c: ClassTypeFilter) => void;
  onSetSqftRange: (min: number, max: number) => void;
  onSetStates: (states: Set<string>) => void;
  onSetRadius: (miles: number | null) => void;
}

export function FilterPanel({
  filters,
  availableStates,
  sqftRange,
  onToggleCompanyType,
  onSetClassType,
  onSetSqftRange,
  onSetStates,
  onSetRadius,
}: Props) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <CompanyTypeFilter
          selected={filters.companyTypes}
          onToggle={onToggleCompanyType}
        />
        <ClassTypeToggle value={filters.classType} onChange={onSetClassType} />
        <SqftSlider
          min={sqftRange.min}
          max={sqftRange.max}
          valueMin={filters.sqftMin}
          valueMax={filters.sqftMax}
          onChange={onSetSqftRange}
        />
        <StateMultiSelect
          available={availableStates}
          selected={filters.states}
          onChange={onSetStates}
        />
        <RadiusFilter value={filters.radiusMiles} onChange={onSetRadius} />
      </div>
    </div>
  );
}
