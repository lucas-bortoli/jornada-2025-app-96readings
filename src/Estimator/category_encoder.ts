interface SerializedCategoryEncoder {
  encoded: Record<string, number>;
  decoded: Record<number, string>;
}

/**
 * A class for encoding and decoding categorical features.
 */
export default class CategoryEncoder {
  private encoded: Map<string, number>;
  private decoded: Map<number, string>;

  /**
   * Creates a CategoryEncoder with the given target features.
   * @param targetFeatures An array of unique feature strings.
   */
  constructor(targetFeatures: string[]) {
    const uniqueFeatures = [...new Set(targetFeatures)].toSorted((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    this.encoded = new Map(uniqueFeatures.map((f, hotIdx) => [f, hotIdx] as const));
    this.decoded = new Map(uniqueFeatures.map((f, hotIdx) => [hotIdx, f] as const));
  }

  get categoryCount() {
    return this.encoded.size;
  }

  /**
   * Encodes a feature string into a one-hot vector.
   * @param feature The feature string to encode.
   * @returns A one-hot vector representing the feature.
   * @throws Error if the feature is not found in the encoder.
   */
  encode(feature: string) {
    const hotIdx = this.encoded.get(feature)!;

    if (hotIdx === undefined) {
      throw new Error(`Feature "${feature}" not found in encoder.`);
    }

    const list = new Array(this.encoded.size).fill(0) as number[];
    list[hotIdx] = 1;

    return list;
  }

  /**
   * Decodes a probability distribution into the corresponding feature category, using greedy sampling.
   * @param probabilities An array of probabilities, where the index represents the feature category.
   * @returns The feature category with the highest probability.
   * @throws Error if the hot index is not found in the decoder.
   */
  decode(probabilities: number[]): string {
    const hotIndex = probabilities.indexOf(Math.max(...probabilities));
    const feature = this.decoded.get(hotIndex);

    if (feature === undefined) {
      throw new Error(`Hot index "${hotIndex}" not found in decoder.`);
    }

    return feature;
  }

  toJSON(): SerializedCategoryEncoder {
    // we can't directly serialize Maps, so convert them to plain objects.
    const encodedObject = Object.fromEntries(this.encoded);
    const decodedObject = Object.fromEntries(this.decoded);

    return { encoded: encodedObject, decoded: decodedObject };
  }

  static fromJSON(json: SerializedCategoryEncoder) {
    const ce = new CategoryEncoder([]);

    ce.encoded = new Map(Object.entries(json.encoded));
    ce.decoded = new Map(Object.entries(json.decoded).map(([k, v]) => [parseInt(k), v]));

    return ce;
  }
}
