import * as tf from "@tensorflow/tfjs";

export type EstimatorVariant = "mini" | "small" | "medium" | "large";

/**
 * Creates a TensorFlow.js model with a specified size (mini, small, medium, large).
 * The model is designed for multi-class classification with 4 input features.
 *
 * @param size The size of the model to create.
 * @returns A TensorFlow.js sequential model.
 */
export default function makeEstimator(size: EstimatorVariant) {
  const model = tf.sequential();

  switch (size) {
    case "mini":
      model.add(
        tf.layers.dense({ units: 8, activation: "relu", inputShape: [4], name: `layer1_${size}` })
      );
      model.add(tf.layers.dense({ units: 4, activation: "relu", name: `layer2_${size}` }));
      model.add(tf.layers.dense({ units: 1, activation: "softmax", name: `output_${size}` }));
      break;
    case "small":
      model.add(
        tf.layers.dense({ units: 16, activation: "relu", inputShape: [4], name: `layer1_${size}` })
      );
      model.add(tf.layers.dense({ units: 8, activation: "relu", name: `layer2_${size}` }));
      model.add(tf.layers.dense({ units: 1, activation: "softmax", name: `output_${size}` }));
      break;
    case "medium":
      model.add(
        tf.layers.dense({ units: 32, activation: "relu", inputShape: [4], name: `layer1_${size}` })
      );
      model.add(tf.layers.dense({ units: 16, activation: "relu", name: `layer2_${size}` }));
      model.add(tf.layers.dense({ units: 1, activation: "softmax", name: `output_${size}` }));
      break;
    case "large":
      model.add(
        tf.layers.dense({ units: 64, activation: "relu", inputShape: [4], name: `layer1_${size}` })
      );
      model.add(tf.layers.dense({ units: 32, activation: "relu", name: `layer2_${size}` }));
      model.add(tf.layers.dense({ units: 16, activation: "relu", name: `layer3_${size}` }));
      model.add(tf.layers.dense({ units: 1, activation: "softmax", name: `output_${size}` }));
      break;
  }

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy", // useful for multi-class
    metrics: ["accuracy"],
  });

  return model;
}

/**
 * Estimates the number of epochs for training.
 *
 * @param k - Complexity factor (please please please tune this for the target hardware).
 * @param n - Number of trainable parameters in the model.
 * @param u - Number of training samples.
 * @param numFeatures - Number of input features.
 * @param numClasses - Number of classes.
 * @returns Estimated number of epochs.
 */
export function estimateEpochs(
  k: number,
  n: number,
  u: number,
  numFeatures: number,
  numClasses: number
): number {
  const d = numFeatures * numClasses;
  const epochs = k * (n / u) * d;
  return Math.ceil(epochs); // <<< round up
}

//@ts-expect-error
window.makeEstimator = makeEstimator;
