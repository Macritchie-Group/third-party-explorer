import type { Facility } from "../types/facility";

export function exportCsv(facilities: Facility[], filename: string) {
  const headers = [
    "MasterID",
    "StoreID",
    "StoreName",
    "Address",
    "City",
    "State",
    "ZipCode",
    "TotalSqft",
    "RentableSqft",
    "CompanyType",
    "ClassType",
    "OwnerCompanyName",
    "lat",
    "lon",
  ];

  const rows = facilities.map((f) =>
    [
      f.MasterID,
      f.StoreID,
      csvEscape(f.StoreName),
      csvEscape(f.Address),
      csvEscape(f.City),
      f.State,
      f.ZipCode,
      f.TotalSqft,
      f.RentableSqft,
      f.CompanyType,
      f.ClassType,
      csvEscape(f.OwnerCompanyName),
      f.lat,
      f.lon,
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
