export type Sequence = number & { _tag?: "sequence" };

export default function sequence(start: number = 0) {
  let value = start;

  return function next(): Sequence {
    value++;
    return value;
  };
}

export function persistentSequence(key: string, start: number = 0) {
  let storedValue: number | null = null;

  // Initialize from localStorage on first use
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      storedValue = parseInt(stored, 10);
      if (isNaN(storedValue)) {
        storedValue = null; // Handle invalid stored value
      }
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    storedValue = null;
  }

  let value: number = storedValue ?? start; // Use stored value or default

  return function next(): Sequence {
    value++;

    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Error storing sequence in localStorage:", error);
    }

    return value;
  };
}
