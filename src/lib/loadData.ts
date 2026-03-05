import Papa from "papaparse";
import type { Facility } from "../types/facility";

export async function loadData(): Promise<{
  owned: Facility[];
  targets: Facility[];
}> {
  const res = await fetch("/supply_geocoded.csv");
  const text = await res.text();

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const owned: Facility[] = [];
  const targets: Facility[] = [];

  for (const row of data) {
    const lat = parseFloat(row.lat);
    const lon = parseFloat(row.lon);
    if (!lat || !lon) continue;

    const facility: Facility = {
      MasterID: parseInt(row.MasterID, 10),
      StoreID: parseInt(row.StoreID, 10),
      isOwned: row["Is Owned"] === "Yes",
      StoreName: row.StoreName,
      Address: row.Address,
      City: row.City,
      State: row.State,
      ZipCode: row.ZipCode,
      TotalSqft: parseInt(row.TotalSqft, 10) || 0,
      RentableSqft: parseInt(row.RentableSqft, 10) || 0,
      CompanyType: row.CompanyType as Facility["CompanyType"],
      ClassType: row.ClassType as Facility["ClassType"],
      OwnerCompanyName: row.OwnerCompanyName,
      full_address: row.full_address,
      full_fips: row.full_fips,
      lat,
      lon,
    };

    if (facility.isOwned) {
      owned.push(facility);
    } else if (facility.CompanyType !== "REIT") {
      targets.push(facility);
    }
    // REITs are dropped entirely
  }

  return { owned, targets };
}

export function toGeoJSON(
  facilities: Facility[]
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: facilities.map((f) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [f.lon, f.lat] },
      properties: f,
    })),
  };
}
