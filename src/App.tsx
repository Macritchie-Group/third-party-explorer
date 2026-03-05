import { useRef, useCallback } from "react";
import { useData } from "./hooks/useData";
import { useFilters } from "./hooks/useFilters";
import { FilterPanel } from "./components/sidebar/FilterPanel";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { MapView } from "./components/map/MapView";
import type { Facility } from "./types/facility";
import type { MapRef } from "react-map-gl/mapbox";

export default function App() {
  const { owned, targets, loading, availableStates, sqftRange } = useData();
  const {
    filters,
    filtered,
    toggleCompanyType,
    setClassType,
    setSqftRange,
    setStates,
    setRadius,
  } = useFilters(targets, owned);

  const mapRef = useRef<MapRef>(null);

  const handleSelectFacility = useCallback((f: Facility) => {
    mapRef.current?.flyTo({
      center: [f.lon, f.lat],
      zoom: 14,
      duration: 1500,
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <FilterPanel
        filters={filters}
        availableStates={availableStates}
        sqftRange={sqftRange}
        onToggleCompanyType={toggleCompanyType}
        onSetClassType={setClassType}
        onSetSqftRange={setSqftRange}
        onSetStates={setStates}
        onSetRadius={setRadius}
      />
      <div className="flex-1 relative">
        <MapView
          owned={owned}
          filtered={filtered}
          ref={mapRef}
        />
      </div>
      <ResultsPanel results={filtered} onSelect={handleSelectFacility} />
    </div>
  );
}
