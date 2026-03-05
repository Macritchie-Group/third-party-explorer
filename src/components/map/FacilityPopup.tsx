import { Popup } from "react-map-gl/mapbox";
import type { Facility } from "../../types/facility";

interface Props {
  facility: Facility;
  onClose: () => void;
}

export function FacilityPopup({ facility: f, onClose }: Props) {
  return (
    <Popup
      longitude={f.lon}
      latitude={f.lat}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      maxWidth="320px"
    >
      <div className="text-sm leading-relaxed">
        <h3 className="font-bold text-base mb-1">{f.StoreName}</h3>
        <p className="text-gray-600">{f.full_address}</p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-gray-500">Type:</span>
          <span>{f.CompanyType}</span>
          <span className="text-gray-500">Class:</span>
          <span>{f.ClassType}</span>
          <span className="text-gray-500">Total Sqft:</span>
          <span>{f.TotalSqft.toLocaleString()}</span>
          <span className="text-gray-500">Rentable:</span>
          <span>{f.RentableSqft.toLocaleString()}</span>
          <span className="text-gray-500">Owner:</span>
          <span className="truncate">{f.OwnerCompanyName}</span>
        </div>
        {f.isOwned && (
          <div className="mt-2 text-amber-600 font-semibold">Owned</div>
        )}
      </div>
    </Popup>
  );
}
