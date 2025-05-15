import { useMemo, useState } from "react";

/**
 * A function that takes a subject and returns a number for sorting.
 */
type SortFn<Subject> = (subject: Subject) => number;

/**
 * A mapping from sort methods to their corresponding sort functions.
 */
type SortMap<Method extends string, Subject> = {
  [k in Method]: SortFn<Subject>;
};

/**
 * A custom hook for sorting a list of subjects based on dynamic criteria.
 *
 * Features:
 * - Maintains current sort method and reverse state
 * - Recalculates sorted results when method/reverse state changes
 * - Optimized with useMemo to avoid redundant sorting
 * - Assumes `subjects` is memoized by the caller for optimal performance
 *
 * @param options - Configuration for sorting behavior.
 * @param options.subjects - The array of subjects to be sorted.
 *   **Note**: This array should be memoized by the caller (e.g., using `useMemo`)
 *   to ensure the hook re-sorts only when necessary.
 * @param options.map - A mapping of sort methods to their respective sorting functions.
 * @param options.initialMethod - The initial sort method to apply.
 * @param options.initialReversed - The initial state of the reverse flag.
 * @returns An object containing:
 *   - sorted: The currently sorted array of subjects
 *   - method: Current active sort method
 *   - setMethod: Function to update the active sort method
 *   - reversed: Current reverse state
 *   - setReversed: Function to update the reverse state
 */
export default function useSort<Method extends string, Subject>(options: {
  subjects: Subject[];
  map: SortMap<Method, Subject>;
  initialMethod: Method;
  initialReversed: boolean;
}) {
  const [method, setMethod] = useState(options.initialMethod);
  const [reversed, setReversed] = useState(options.initialReversed);

  const sorted = useMemo(() => {
    // get the current sort function from the map
    const fn = options.map[method];

    // create a comparator function that calculates score using the current sort function
    const sort = (a: Subject, b: Subject) => {
      const score = fn(b) - fn(a);
      return reversed ? score * -1 : score;
    };

    return options.subjects.toSorted(sort);
  }, [method, reversed, options.subjects]);

  return {
    sorted,
    method,
    setMethod,
    reversed,
    setReversed,
  };
}
