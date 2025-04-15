/**
 * Generates pseudo-random numbers.
 *
 * @param seed - The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export default function RNGAwful(seed: number) {
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;

  let state = seed;

  return () => {
    state = (a * state + c) % m;
    const roll = state / m; // Normalize to [0, 1)
    return roll;
  };
}

/**
 * Shuffles an array using a seeded pseudo-random number generator.
 *
 * @param array - The array to shuffle.
 * @param seed - Seed value for deterministic shuffling.
 * @returns A new shuffled array.
 */
export function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = RNGAwful(seed);
  const result = array.slice(); // copy array

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
