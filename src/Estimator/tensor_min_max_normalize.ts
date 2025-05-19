import * as tf from "@tensorflow/tfjs";

/**
 * A scaler that normalizes features by scaling each feature to a given range (default [0, 1]).
 */
export default class MinMaxScaler {
  /**
   * The minimum values for each feature (column) computed during fit.
   */
  private min!: number[];

  /**
   * The maximum values for each feature (column) computed during fit.
   */
  private max!: number[];

  /**
   * Serializes the scaler's parameters (min and max values) into a JSON-compatible object.
   * @returns An object containing the min and max values for each feature.
   */
  toJSON(): MinMaxScalerData {
    return { min: this.min, max: this.max };
  }

  /**
   * Deserializes a MinMaxScaler instance from a JSON-compatible object.
   * @param data - The data to deserialize.
   * @returns A new instance of MinMaxScaler.
   */
  static fromJSON(data: MinMaxScalerData): MinMaxScaler {
    const scaler = new MinMaxScaler();
    scaler.min = data.min;
    scaler.max = data.max;
    return scaler;
  }

  /**
   * Fits the scaler to the provided tensor, computing the min and max values for each column.
   * @param  tensor - The input tensor to compute min and max values from.
   */
  computeRange(tensor: tf.Tensor2D): void {
    const { mins, maxs } = tf.tidy(() => {
      const mins = tensor.min(0);
      const maxs = tensor.max(0);
      return {
        mins: Array.from(mins.dataSync()),
        maxs: Array.from(maxs.dataSync()),
      };
    });
    this.min = mins;
    this.max = maxs;
  }

  /**
   * Transforms the input tensor by scaling each feature to the range [0, 1].
   * @param tensor - The input tensor to be transformed.
   * @returns The normalized tensor.
   * @throws If the scaler has not been fitted (computeRange has not been called).
   */
  transform(tensor: tf.Tensor2D): tf.Tensor2D {
    if (!this.min || !this.max) {
      throw new Error("Scaler has not been fitted. Call computeRange() first.");
    }
    return tf.tidy(() => {
      const minTensor = tf.tensor2d([this.min]);
      const maxTensor = tf.tensor2d([this.max]);
      const range = maxTensor.sub(minTensor);
      return tensor.sub(minTensor).div(range);
    });
  }
}

export type MinMaxScalerData = {
  min: number[];
  max: number[];
};
