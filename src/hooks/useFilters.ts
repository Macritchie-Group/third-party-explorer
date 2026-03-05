import { useMemo, useState } from "react";
import type {
  ClassTypeFilter,
  CompanyTypeFilter,
  Facility,
  FilterState,
} from "../types/facility";
import { filterFacilities } from "../lib/filterFacilities";

const DEFAULT_FILTERS: FilterState = {
  companyTypes: new Set<CompanyTypeFilter>(["Multi-Op"]),
  classType: "All",
  sqftMin: 0,
  sqftMax: Infinity,
  states: new Set(),
  radiusMiles: null,
};

export function useFilters(targets: Facility[], owned: Facility[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterFacilities(targets, owned, filters),
    [targets, owned, filters]
  );

  function toggleCompanyType(type: CompanyTypeFilter) {
    setFilters((prev) => {
      const next = new Set(prev.companyTypes);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return { ...prev, companyTypes: next };
    });
  }

  function setClassType(classType: ClassTypeFilter) {
    setFilters((prev) => ({ ...prev, classType }));
  }

  function setSqftRange(min: number, max: number) {
    setFilters((prev) => ({ ...prev, sqftMin: min, sqftMax: max }));
  }

  function setStates(states: Set<string>) {
    setFilters((prev) => ({ ...prev, states }));
  }

  function setRadius(miles: number | null) {
    setFilters((prev) => ({ ...prev, radiusMiles: miles }));
  }

  return {
    filters,
    filtered,
    toggleCompanyType,
    setClassType,
    setSqftRange,
    setStates,
    setRadius,
  };
}
