import { ImperativeObject } from "../Lib/imperative_object";
import generateUUID from "../Lib/uuid";
import CategoryEncoder from "./category_encoder";
import { shuffleArray } from "./rng_awful";
import trainTestSplit from "./train_test_split";
import makeEstimator, { estimateEpochs, EstimatorVariant } from "./training/model_templates";
import * as tf from "@tensorflow/tfjs";

export type DatasetX = [number, number, number, number, number];
export type DatasetY = string;
export type DatasetRow = [...DatasetX, DatasetY];

export type DatasetYEncoded = (0 | 1)[]; // one-hot encoding
export type DatasetRowEncoded = [...DatasetX, DatasetYEncoded];

export const X = (xyRow: DatasetRow) => xyRow.slice(0, 5) as DatasetX;
export const y = (xyRow: DatasetRow) => xyRow[5] as DatasetY[0];

export interface Epoch {
  accuracy: number;
  startTimestamp: number;
}

export interface Progress {
  state: "StillTraining" | "Complete";

  dataset: {
    train: DatasetRowEncoded[];
    test: DatasetRowEncoded[];
  };

  totalEpochs: number;

  /**
   * All epochs the training underwent so far. The current epoch is the last item in the array.
   */
  epochs: Epoch[];

  signal: AbortSignal;
}

export default class TrainingCycle implements ImperativeObject {
  public readonly uuid: string = generateUUID();
  public readonly estimator: tf.Sequential;

  public progress: Progress | null;

  constructor(variant: EstimatorVariant) {
    this.estimator = makeEstimator(variant);
    this.progress = null;
  }

  startTraining(dataset: DatasetRow[]) {
    if (this.progress !== null) {
      throw new Error("Training is already in progress!");
    }

    const categoryEncoder = new CategoryEncoder(dataset.map(y));

    const datasetEncoded = dataset.map(
      (row) => [...X(row), categoryEncoder.encode(y(row))] as DatasetRowEncoded
    );

    const { train, test } = trainTestSplit(shuffleArray(datasetEncoded, 1000), 0.1);

    this.progress = {
      state: "StillTraining",
      dataset: { train, test },
      totalEpochs: estimateEpochs(
        0.5,
        this.estimator.countParams(),
        train.length,
        X(dataset[0]).length,
        categoryEncoder.categoryCount
      ),
      epochs: [],
    };
  }
}
