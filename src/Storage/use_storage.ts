import { DependencyList, useEffect, useState } from "react";

export function useStorageQuery<G extends () => Promise<V>, V = Awaited<ReturnType<G>>>(
  getter: G,
  deps: DependencyList
): V | null {
  const [value, setValue] = useState<V | null>(null);

  useEffect(() => {
    getter().then((v) => setValue(v));
  }, [...deps]);

  return value;
}
