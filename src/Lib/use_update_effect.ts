import { useEffect, useRef } from "react";

/**
 * A custom hook that mimics `useEffect` but only runs after the initial render.
 *
 * It's strongly typed to ensure type safety for the effect function and dependencies.
 *
 * @template T The return type of the effect function (optional - defaults to void).
 * @param effect The effect function to run after the initial render.
 * @param dependencies An array of dependencies. The effect will re-run if any of these change.
 * @returns The return value of the effect function.
 */
export default function useUpdateEffect<T>(
  effect: () => void | (() => void),
  dependencies: any[]
): T | void {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return; // Skip the first render
    }

    return effect();
  }, dependencies);
}
