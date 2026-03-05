import type { Facility, FilterState } from "../types/facility";
import { haversine } from "./distance";

export function filterFacilities(
  targets: Facility[],
  owned: Facility[],
  filters: FilterState
): Facility[] {
  return targets.filter((f) => {
    // CompanyType
    if (!filters.companyTypes.has(f.CompanyType as "Multi-Op" | "Single-Op")) {
      return false;
    }

    // ClassType
    if (filters.classType !== "All" && f.ClassType !== filters.classType) {
      return false;
    }

    // Sqft range
    if (f.TotalSqft < filters.sqftMin || f.TotalSqft > filters.sqftMax) {
      return false;
    }

    // States
    if (filters.states.size > 0 && !filters.states.has(f.State)) {
      return false;
    }

    // Radius: keep only targets within N miles of any owned facility
    if (filters.radiusMiles !== null) {
      const withinRadius = owned.some(
        (o) => haversine(f.lat, f.lon, o.lat, o.lon) <= filters.radiusMiles!
      );
      if (!withinRadius) return false;
    }

    return true;
  });
}
