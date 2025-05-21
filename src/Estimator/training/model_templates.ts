import * as tf from "@tensorflow/tfjs";

export type EstimatorVariant = "mini" | "small" | "medium" | "large";

/**
 * Creates a TensorFlow.js model with a specified size (mini, small, medium, large).
 * The model is designed for multi-class classification with 5 input features.
 *
 * @param size The size of the model to create.
 * @param numClasses How many classes will this model learn? This information is important for the model's output layer.
 * @returns A TensorFlow.js sequential model.
 */
export default function makeEstimator(size: EstimatorVariant, numClasses: number) {
  const model = tf.sequential();

  switch (size) {
    case "mini":
      model.add(tf.layers.dense({ units: 8, activation: "relu", inputShape: [5] }));
      model.add(tf.layers.dense({ units: 4, activation: "relu" }));
      break;

    case "small":
      model.add(tf.layers.dense({ units: 16, activation: "relu", inputShape: [5] }));
      model.add(tf.layers.dense({ units: 8, activation: "relu" }));
      break;

    case "medium":
      model.add(tf.layers.dense({ units: 32, activation: "relu", inputShape: [5] }));
      model.add(tf.layers.dense({ units: 16, activation: "relu" }));
      model.add(tf.layers.dense({ units: 8, activation: "relu" }));
      break;

    case "large":
      model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [5] }));
      model.add(tf.layers.dense({ units: 32, activation: "relu" }));
      model.add(tf.layers.dense({ units: 16, activation: "relu" }));
      model.add(tf.layers.dense({ units: 8, activation: "relu" }));
      break;
  }

  // output layer
  model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "categoricalCrossentropy",
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
