import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/mapbox";
import type { Facility } from "../../types/facility";
import { toGeoJSON } from "../../lib/loadData";

interface Props {
  filtered: Facility[];
}

export function TargetLayers({ filtered }: Props) {
  const geojson = useMemo(() => toGeoJSON(filtered), [filtered]);

  return (
    <Source
      id="targets"
      type="geojson"
      data={geojson}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      {/* Cluster circles */}
      <Layer
        id="target-clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        }}
      />

      {/* Cluster count labels */}
      <Layer
        id="target-cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        }}
      />

      {/* Individual points */}
      <Layer
        id="target-circles"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-color": [
            "case",
            ["==", ["get", "CompanyType"], "Multi-Op"],
            "#D4A017",
            "#2563EB",
          ],
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        }}
      />
    </Source>
  );
}
