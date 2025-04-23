interface SerializedLabelEncoder {
  encoded: Record<string, number>;
  decoded: Record<number, string>;
}

/**
 * A class for encoding and decoding categorical labels.
 */
export default class LabelEncoder {
  private encoded: Map<string, number>;
  private decoded: Map<number, string>;

  /**
   * Creates a LabelEncoder with the given target labels.
   * @param targetLabels An array of unique label strings.
   */
  constructor(targetLabels: string[]) {
    const uniqueLabels = [...new Set(targetLabels)].toSorted((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    this.encoded = new Map(uniqueLabels.map((f, value) => [f, value] as const));
    this.decoded = new Map(uniqueLabels.map((f, value) => [value, f] as const));
  }

  get categoryCount() {
    return this.encoded.size;
  }

  get labels() {
    return [...this.encoded.keys()];
  }

  /**
   * Encodes a label string into an integer.
   * @param label The label string to encode.
   * @returns An integer representing the label.
   * @throws Error if the label is not found in the encoder.
   */
  encodeStringToInt(label: string) {
    const value = this.encoded.get(label)!;

    if (value === undefined) {
      throw new Error(`Feature "${label}" not found in encoder.`);
    }

    return value;
  }

  /**
   * Decodes an int into the corresponding label category.
   * @param value An integer represents the label category.
   * @returns The label category.
   * @throws Error if the hot index is not found in the decoder.
   */
  decodeIntToString(value: number): string {
    const label = this.decoded.get(value);

    if (label === undefined) {
      throw new Error(`Hot index "${value}" not found in decoder.`);
    }

    return label;
  }

  toJSON(): SerializedLabelEncoder {
    // we can't directly serialize Maps, so convert them to plain objects.
    const encodedObject = Object.fromEntries(this.encoded);
    const decodedObject = Object.fromEntries(this.decoded);

    return { encoded: encodedObject, decoded: decodedObject };
  }

  static fromJSON(json: SerializedLabelEncoder) {
    const ce = new LabelEncoder([]);

    ce.encoded = new Map(Object.entries(json.encoded));
    ce.decoded = new Map(Object.entries(json.decoded).map(([k, v]) => [parseInt(k), v]));

    return ce;
  }
}
