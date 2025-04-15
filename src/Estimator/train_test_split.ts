export default function trainTestSplit<T>(
  data: T[],
  testSize: number = 0.2
): { train: T[]; test: T[] } {
  const testCount = Math.floor(data.length * testSize);
  const test = data.slice(0, testCount);
  const train = data.slice(testCount);

  return { train, test };
}
