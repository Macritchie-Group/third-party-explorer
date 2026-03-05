export interface Facility {
  MasterID: number;
  StoreID: number;
  isOwned: boolean;
  StoreName: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  TotalSqft: number;
  RentableSqft: number;
  CompanyType: "Single-Op" | "Multi-Op" | "REIT";
  ClassType: "A" | "B" | "C";
  OwnerCompanyName: string;
  full_address: string;
  full_fips: string;
  lat: number;
  lon: number;
}

export type CompanyTypeFilter = "Multi-Op" | "Single-Op";
export type ClassTypeFilter = "A" | "B" | "C" | "All";

export interface FilterState {
  companyTypes: Set<CompanyTypeFilter>;
  classType: ClassTypeFilter;
  sqftMin: number;
  sqftMax: number;
  states: Set<string>;
  radiusMiles: number | null;
}

export interface GeoJSONFacility
  extends GeoJSON.Feature<GeoJSON.Point, Facility> {}
