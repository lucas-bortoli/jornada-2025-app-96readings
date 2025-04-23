import * as tf from "@tensorflow/tfjs";
import { ImperativeObject, notifyUpdate } from "../Lib/imperative_object";
import { RunAsync } from "../Lib/run";
import generateUUID from "../Lib/uuid";
import LabelEncoder from "./label_encoder";
import { shuffleArray } from "./rng_awful";
import makeEstimator, { EstimatorVariant } from "./training/model_templates";

export type DatasetX = [number, number, number, number, number];
export type DatasetY = string;
export type DatasetRow = [...DatasetX, DatasetY];

export type DatasetYEncoded = number;
export type DatasetRowEncoded = [...DatasetX, DatasetYEncoded];

export const X = (xyRow: DatasetRow | DatasetRowEncoded) => xyRow.slice(0, 5) as DatasetX;
export const y = <R extends DatasetRow | DatasetRowEncoded>(xyRow: R) => xyRow[5] as R[5];

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
}

export function progressPercentage(progress: Progress) {
  return progress.epochs.length / (progress.totalEpochs + 1);
}

export default class TrainingCycle implements ImperativeObject {
  public readonly uuid: string = generateUUID();
  public readonly estimator: tf.Sequential;
  public readonly numClasses: number;

  public progress: Progress | null;

  constructor(variant: EstimatorVariant, numClasses: number) {
    this.numClasses = numClasses;
    this.estimator = makeEstimator(variant, numClasses);
    this.progress = null;
  }

  startTraining(dataset: DatasetRow[]) {
    if (this.progress !== null) {
      throw new Error("Training is already in progress!");
    }

    dataset = shuffleArray(dataset, 1234);

    const le = new LabelEncoder(dataset.map(y));

    const X_values = dataset.map(X);
    const y_values_encoded = dataset.map(y).map((str) => le.encodeStringToInt(str));

    const tX = tf.tensor2d(X_values);
    const tY = tf.oneHot(tf.tensor1d(y_values_encoded, "int32"), this.numClasses);

    RunAsync(async (defer) => {
      await this.estimator.fit(tX, tY, {
        validationSplit: 0.2,
        callbacks: {
          onEpochBegin: async (epoch, logs) => {
            console.log(`🚀 Starting epoch ${epoch + 1}`);
            notifyUpdate(this);
          },
          onEpochEnd: async (epoch, logs) => {
            console.log(
              `✅ Finished epoch ${epoch + 1} - loss: ${logs?.loss?.toFixed(4)}, val_loss: ${logs?.val_loss?.toFixed(4)}`
            );

            // condição de early-stopping
            if (logs?.val_loss !== undefined && logs.val_loss < 0.05) {
              console.log("🛑 Validation loss is low. Stopping early.");
              this.estimator.stopTraining = true;
            }

            notifyUpdate(this);
          },
          onTrainBegin: async (logs) => {
            console.log("📈 Training has started!");
            notifyUpdate(this);
          },
          onTrainEnd: async (logs) => {
            console.log("🏁 Training complete!");
            notifyUpdate(this);
          },
          onBatchEnd: async (batch, logs) => {
            if (batch % 50 === 0) {
              console.log(`🔄 Batch ${batch} - loss: ${logs?.loss?.toFixed(4)}`);
            }
            notifyUpdate(this);
          },
        },
      });

      console.log("Finished training async callback.");
    });

    /*const { train, test } = trainTestSplit(shuffleArray(datasetEncoded, 1000), 0.1);

    this.progress = {
      state: "StillTraining",
      dataset: { train, test },
      totalEpochs: estimateEpochs(
        0.1,
        this.estimator.countParams(),
        train.length,
        X(dataset[0]).length,
        categoryEncoder.categoryCount
      ),
      epochs: [],
    };*/

    //this.estimator.fit(tX, tY, {
    //  epochs:
    //});

    notifyUpdate(this);
  }

  stop() {}
}
