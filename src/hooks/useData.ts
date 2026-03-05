import { useEffect, useState } from "react";
import type { Facility } from "../types/facility";
import { loadData } from "../lib/loadData";

export function useData() {
  const [owned, setOwned] = useState<Facility[]>([]);
  const [targets, setTargets] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData()
      .then(({ owned, targets }) => {
        setOwned(owned);
        setTargets(targets);
      })
      .finally(() => setLoading(false));
  }, []);

  // Derive available states from targets
  const availableStates = Array.from(new Set(targets.map((t) => t.State))).sort();

  // Derive sqft range
  const sqftRange = targets.reduce(
    (acc, t) => ({
      min: Math.min(acc.min, t.TotalSqft),
      max: Math.max(acc.max, t.TotalSqft),
    }),
    { min: Infinity, max: 0 }
  );

  return { owned, targets, loading, availableStates, sqftRange };
}
