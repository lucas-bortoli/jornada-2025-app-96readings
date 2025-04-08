import { useMemo, useRef, useState } from "react";
import sequence from "./sequence_generator";

/**
 * Defines the interface for the mutation methods available for a Map state.
 */
interface MapMutateMethods<K, V> {
  /**
   * Sets a key-value pair in the Map.
   * @param key The key to set.
   * @param value The value to associate with the key.
   * @void
   */
  set: (key: K, value: V) => void;

  /**
   * Deletes a key-value pair from the Map.
   * @param key The key to delete.
   * @void
   */
  delete: (key: K) => void;

  /**
   * Clears all key-value pairs from the Map.
   * @void
   */
  clear: () => void;

  /**
   * Adds a key to the Map if it doesn't exist, else removes the key.
   * @param value The key to toggle.
   * @void
   */
  toggle: (key: K, value: V) => void;
}

/**
 * A custom React hook for managing Map state.
 * It provides methods for mutating the Map while ensuring React detects changes.
 * @template K The type of the Map keys.
 * @template V The type of the Map values.
 * @param provideMap Optional function to provide an initial Map.  If not provided, a new empty Map is created.
 * @returns A tuple containing:
 *   - The current Map instance (read-only).
 *   - An object with methods for mutating the Map (set, delete, clear).
 *   - A unique key that triggers re-renders when the Map is mutated.
 */
export function useStateMap<K, V>(provideMap?: () => Map<K, V>) {
  // useRef to hold the Map instance.  This persists across re-renders.
  const map = useRef<Map<K, V>>(provideMap?.() ?? new Map());
  // useRef to hold a sequence generator for creating unique keys.
  const mapKeySequence = useRef(sequence());
  // useState to store a key that triggers re-renders when the Map is mutated.
  const [mapKey, setMutationKey] = useState(() => mapKeySequence.current());

  /**
   * Memoized object containing the Map mutation methods.
   * useMemo ensures that the object is only recreated when dependencies change (which is never in this case).
   */
  const mutationMethods: MapMutateMethods<K, V> = useMemo(
    () => ({
      set: (key: K, value: V) => {
        map.current.set(key, value);
        setMutationKey(mapKeySequence.current()); // Trigger re-render
      },
      delete: (key: K) => {
        map.current.delete(key);
        setMutationKey(mapKeySequence.current()); // Trigger re-render
      },
      clear: () => {
        map.current.clear();
        setMutationKey(mapKeySequence.current()); // Trigger re-render
      },
      toggle: (key: K, value: V) => {
        if (map.current.has(key)) {
          map.current.delete(key);
        } else {
          map.current.set(key, value);
        }
        setMutationKey(mapKeySequence.current()); // Trigger re-render
      },
    }),
    [] // Empty dependency array: this object is only created once.
  );

  // Return the current Map (read-only), mutation methods, and the key for triggering re-renders.
  return [map.current as ReadonlyMap<K, V>, mutationMethods, mapKey] as const;
}

/**
 * Defines the interface for the mutation methods available for a Set state.
 */
interface SetMutateMethods<V> {
  /**
   * Adds a value to the Set.
   * @param value The value to add.
   * @void
   */
  add: (value: V) => void;

  /**
   * Deletes a value from the Set.
   * @param value The value to delete.
   * @void
   */
  delete: (value: V) => void;

  /**
   * Clears all values from the Set.
   * @void
   */
  clear: () => void;

  /**
   * Adds a value to the Set if it doesn't exist, else removes the value.
   * @param value The value to toggle.
   * @void
   */
  toggle: (value: V) => void;
}

/**
 * A custom React hook for managing Set state.
 * It provides methods for mutating the Set while ensuring React detects changes.
 * @template V The type of the Set values.
 * @param provideSet Optional function to provide an initial Set. If not provided, a new empty Set is created.
 * @returns A tuple containing:
 *   - The current Set instance (read-only).
 *   - An object with methods for mutating the Set (add, delete, clear).
 *   - A unique key that triggers re-renders when the Set is mutated.
 */
export function useStateSet<V>(provideSet?: () => Set<V>) {
  // useRef to hold the Set instance. This persists across re-renders.
  const set = useRef<Set<V>>(provideSet?.() ?? new Set());
  // useRef to hold a sequence generator for creating unique keys.
  const setKeySequence = useRef(sequence());
  // useState to store a key that triggers re-renders when the Set is mutated.
  const [setKey, setMutationKey] = useState(() => setKeySequence.current());

  /**
   * Memoized object containing the Set mutation methods.
   * useMemo ensures that the object is only recreated when dependencies change (which is never in this case).
   */
  const mutationMethods: SetMutateMethods<V> = useMemo(
    () => ({
      add: (value: V) => {
        set.current.add(value);
        setMutationKey(setKeySequence.current()); // Trigger re-render
      },
      delete: (value: V) => {
        set.current.delete(value);
        setMutationKey(setKeySequence.current()); // Trigger re-render
      },
      clear: () => {
        set.current.clear();
        setMutationKey(setKeySequence.current()); // Trigger re-render
      },
      toggle: (value: V) => {
        if (set.current.has(value)) {
          set.current.delete(value);
        } else {
          set.current.add(value);
        }
        setMutationKey(setKeySequence.current()); // Trigger re-render
      },
    }),
    [] // Empty dependency array: this object is only created once.
  );

  // Return the current Set (read-only), mutation methods, and the key for triggering re-renders.
  return [set.current as ReadonlySet<V>, mutationMethods, setKey] as const;
}
