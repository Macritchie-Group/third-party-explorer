import { Marker } from "react-map-gl/mapbox";
import type { Facility } from "../../types/facility";

interface Props {
  owned: Facility[];
  onSelect: (f: Facility) => void;
}

export function OwnedMarkers({ owned, onSelect }: Props) {
  return (
    <>
      {owned.map((f) => (
        <Marker
          key={f.MasterID}
          longitude={f.lon}
          latitude={f.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSelect(f);
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill="#D4A017"
              stroke="#8B6914"
              strokeWidth="1"
            />
          </svg>
        </Marker>
      ))}
    </>
  );
}
