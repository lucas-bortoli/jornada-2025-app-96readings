import * as tf from "@tensorflow/tfjs";

const targetNames = {
  air: [1, 0, 0, 0, 0, 0],
  anis: [0, 1, 0, 0, 0, 0],
  cinnamon: [0, 0, 1, 0, 0, 0],
  cocoa: [0, 0, 0, 1, 0, 0],
  coffee: [0, 0, 0, 0, 1, 0],
  tea: [0, 0, 0, 0, 0, 1],
};

/**
 * Creates a TensorFlow.js model with a specified size (mini, small, medium, large).
 * The model is designed for multi-class classification with 4 input features.
 *
 * @param { "mini" | "small" | "medium" | "large" } size The size of the model to create.
 * @returns {tf.Sequential} A TensorFlow.js sequential model.
 */
function makeEstimator(size: "mini" | "small" | "medium" | "large") {
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

const ml = makeEstimator("mini");

import CategoryEncoder from "./category_encoder";
import { shuffleArray } from "./rng_awful";
import datasetUrl from "./sample_data.tsv?url";
import trainTestSplit from "./train_test_split";

const dataset = (await (await fetch(datasetUrl)).text())
  .split("\n")
  .slice(1)
  .map(
    (line) =>
      line.split("\t").map((cell, idx) => (idx === 5 ? cell : parseInt(cell))) as [
        number,
        number,
        number,
        number,
        number,
        string,
      ]
  );

console.log(dataset);
//@ts-expect-error
window.dataset = dataset;
//@ts-expect-error
window.CategoryEncoder = CategoryEncoder;
//@ts-expect-error
window.trainTestSplit = trainTestSplit;
//@ts-expect-error
window.shuffleArray = shuffleArray;
