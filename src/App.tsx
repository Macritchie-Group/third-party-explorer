import { useRef, useCallback, useState, useMemo } from "react";
import { useData } from "./hooks/useData";
import { useFilters } from "./hooks/useFilters";
import { FilterPanel } from "./components/sidebar/FilterPanel";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { MapView } from "./components/map/MapView";
import { OwnershipBanner } from "./components/map/OwnershipBanner";
import { parseOwnerPrefix } from "./lib/parseOwnerPrefix";
import type { Facility } from "./types/facility";
import type { MapRef } from "react-map-gl/mapbox";
import type { LngLatBounds } from "mapbox-gl";

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
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
  const [focusOwner, setFocusOwner] = useState<string | null>(null);

  // CR4: Filter by owner prefix when focused
  const displayedFiltered = useMemo(() => {
    if (!focusOwner) return filtered;
    return filtered.filter(
      (f) => parseOwnerPrefix(f.StoreName) === focusOwner
    );
  }, [filtered, focusOwner]);

  const displayedOwned = useMemo(() => {
    if (!focusOwner) return owned;
    return owned.filter(
      (f) => parseOwnerPrefix(f.StoreName) === focusOwner
    );
  }, [owned, focusOwner]);

  const focusCount = displayedFiltered.length + displayedOwned.length;

  // CR5: Viewport-filtered results sorted by RentableSqft desc
  const visibleResults = useMemo(() => {
    const source = displayedFiltered;
    if (!mapBounds) {
      return [...source].sort((a, b) => b.RentableSqft - a.RentableSqft);
    }
    return source
      .filter(
        (f) =>
          f.lon >= mapBounds.getWest() &&
          f.lon <= mapBounds.getEast() &&
          f.lat >= mapBounds.getSouth() &&
          f.lat <= mapBounds.getNorth()
      )
      .sort((a, b) => b.RentableSqft - a.RentableSqft);
  }, [displayedFiltered, mapBounds]);

  const handleMapMove = useCallback(() => {
    const bounds = mapRef.current?.getBounds();
    if (bounds) setMapBounds(bounds);
  }, []);

  const handleFocusOwner = useCallback((f: Facility) => {
    setFocusOwner(parseOwnerPrefix(f.StoreName));
  }, []);

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
          owned={displayedOwned}
          filtered={displayedFiltered}
          ref={mapRef}
          onMapMove={handleMapMove}
          onFacilityClick={handleFocusOwner}
          onMapClick={() => setFocusOwner(null)}
        />
        {focusOwner && (
          <OwnershipBanner
            ownerName={focusOwner}
            facilityCount={focusCount}
            onClose={() => setFocusOwner(null)}
          />
        )}
      </div>
      <ResultsPanel results={visibleResults} onSelect={handleSelectFacility} />
    </div>
  );
}
