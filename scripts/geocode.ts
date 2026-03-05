import "dotenv/config";
import XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error("Missing MAPBOX_TOKEN in .env");
  process.exit(1);
}

const INPUT_FILE = path.resolve("supply_general.xlsx");
const DATA_DIR = path.resolve("data");
const CHECKPOINT_FILE = path.join(DATA_DIR, "checkpoint.json");
const OUTPUT_CSV = path.join(DATA_DIR, "supply_geocoded.csv");
const PUBLIC_CSV = path.resolve("public", "supply_geocoded.csv");

const CHECKPOINT_INTERVAL = 50;
const REQUEST_DELAY_MS = 100;

interface Row {
  MasterID: number;
  StoreID: number;
  "Is Owned": string;
  StoreName: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: number | string;
  TotalSqft: number;
  RentableSqft: number;
  CompanyType: string;
  ClassType: string;
  OwnerCompanyName: string;
  full_address: string;
  full_fips: number | string;
}

interface GeoResult {
  lat: number;
  lon: number;
}

type Checkpoint = Record<string, GeoResult>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function padZip(zip: number | string): string {
  return String(zip).padStart(5, "0");
}

function loadCheckpoint(): Checkpoint {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8"));
  }
  return {};
}

function saveCheckpoint(cp: Checkpoint) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(cp));
}

async function geocode(address: string): Promise<GeoResult | null> {
  const encoded = encodeURIComponent(address);
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encoded}&access_token=${MAPBOX_TOKEN}&limit=1&country=US`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} for: ${address}`);
      return null;
    }
    const json = await res.json();
    const feat = json.features?.[0];
    if (!feat) {
      return null;
    }
    const [lon, lat] = feat.geometry.coordinates;
    return { lat, lon };
  } catch (err) {
    console.warn(`  Fetch error for: ${address}`, err);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  console.log("Reading xlsx...");
  const wb = XLSX.readFile(INPUT_FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: Row[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
  console.log(`Total rows: ${rows.length}`);

  const checkpoint = loadCheckpoint();
  const alreadyDone = Object.keys(checkpoint).length;
  console.log(`Checkpoint has ${alreadyDone} entries`);

  let processed = 0;
  let geocoded = 0;
  let failed = 0;

  for (const row of rows) {
    const id = String(row.MasterID);

    if (checkpoint[id]) {
      continue;
    }

    const zip = padZip(row.ZipCode);
    const address = `${row.Address}, ${row.City}, ${row.State} ${zip}`;

    const result = await geocode(address);
    if (result) {
      checkpoint[id] = result;
      geocoded++;
    } else {
      // Try with just city/state/zip
      const fallback = `${row.City}, ${row.State} ${zip}`;
      const result2 = await geocode(fallback);
      if (result2) {
        checkpoint[id] = result2;
        geocoded++;
      } else {
        checkpoint[id] = { lat: 0, lon: 0 };
        failed++;
      }
    }

    processed++;
    if (processed % CHECKPOINT_INTERVAL === 0) {
      saveCheckpoint(checkpoint);
      const total = alreadyDone + processed;
      console.log(
        `  Checkpoint saved: ${total}/${rows.length} (${geocoded} new, ${failed} failed)`
      );
    }

    await sleep(REQUEST_DELAY_MS);
  }

  // Final save
  saveCheckpoint(checkpoint);
  console.log(
    `Done. Processed ${processed} new rows (${geocoded} geocoded, ${failed} failed)`
  );

  // Write CSV
  console.log("Writing CSV...");
  const headers = [
    "MasterID",
    "StoreID",
    "Is Owned",
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
    "full_address",
    "full_fips",
    "lat",
    "lon",
  ];

  const csvLines = [headers.join(",")];
  for (const row of rows) {
    const id = String(row.MasterID);
    const geo = checkpoint[id] || { lat: 0, lon: 0 };
    const values = [
      row.MasterID,
      row.StoreID,
      csvEscape(String(row["Is Owned"])),
      csvEscape(row.StoreName),
      csvEscape(row.Address),
      csvEscape(row.City),
      row.State,
      padZip(row.ZipCode),
      row.TotalSqft,
      row.RentableSqft,
      csvEscape(row.CompanyType),
      row.ClassType,
      csvEscape(row.OwnerCompanyName),
      csvEscape(row.full_address),
      row.full_fips,
      geo.lat,
      geo.lon,
    ];
    csvLines.push(values.join(","));
  }

  fs.writeFileSync(OUTPUT_CSV, csvLines.join("\n"));
  fs.copyFileSync(OUTPUT_CSV, PUBLIC_CSV);
  console.log(`CSV written to ${OUTPUT_CSV}`);
  console.log(`CSV copied to ${PUBLIC_CSV}`);
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

main().catch(console.error);
