import { forwardRef, useState } from "react";
import Map, { type MapRef } from "react-map-gl/mapbox";
import type { Facility } from "../../types/facility";
import { OwnedMarkers } from "./OwnedMarkers";
import { TargetLayers } from "./TargetLayers";
import { FacilityPopup } from "./FacilityPopup";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  owned: Facility[];
  filtered: Facility[];
  onMapMove?: () => void;
  onFacilityClick?: (f: Facility) => void;
  onMapClick?: () => void;
}

function parseFacilityFromFeature(
  props: Record<string, string>
): Facility {
  return {
    MasterID: parseInt(props.MasterID),
    StoreID: parseInt(props.StoreID),
    isOwned: props.isOwned === "true",
    StoreName: props.StoreName,
    Address: props.Address,
    City: props.City,
    State: props.State,
    ZipCode: props.ZipCode,
    TotalSqft: parseInt(props.TotalSqft),
    RentableSqft: parseInt(props.RentableSqft),
    CompanyType: props.CompanyType as Facility["CompanyType"],
    ClassType: props.ClassType as Facility["ClassType"],
    OwnerCompanyName: props.OwnerCompanyName,
    full_address: props.full_address,
    full_fips: props.full_fips,
    lat: parseFloat(props.lat),
    lon: parseFloat(props.lon),
  };
}

export const MapView = forwardRef<MapRef, Props>(function MapView(
  { owned, filtered, onMapMove, onFacilityClick, onMapClick },
  ref
) {
  const [popup, setPopup] = useState<Facility | null>(null);

  const handleSelect = (f: Facility) => {
    setPopup(f);
    onFacilityClick?.(f);
  };

  return (
    <Map
      ref={ref}
      mapboxAccessToken={TOKEN}
      initialViewState={{ longitude: -98.5, latitude: 39.8, zoom: 4 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      interactiveLayerIds={["target-circles"]}
      onMoveEnd={() => onMapMove?.()}
      onLoad={() => onMapMove?.()}
      onClick={(e) => {
        const feat = e.features?.[0];
        if (feat && !feat.properties?.cluster) {
          const facility = parseFacilityFromFeature(
            feat.properties as unknown as Record<string, string>
          );
          handleSelect(facility);
        } else if (!feat) {
          onMapClick?.();
        }
      }}
    >
      <OwnedMarkers owned={owned} onSelect={handleSelect} />
      <TargetLayers filtered={filtered} />
      {popup && (
        <FacilityPopup facility={popup} onClose={() => setPopup(null)} />
      )}
    </Map>
  );
});
