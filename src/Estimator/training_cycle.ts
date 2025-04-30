import * as tf from "@tensorflow/tfjs";
import { ImperativeObject, notifyUpdate } from "../Lib/imperative_object";
import { RunAsync } from "../Lib/run";
import generateUUID from "../Lib/uuid";
import LabelEncoder from "./label_encoder";
import { shuffleArray } from "./rng_awful";
import minMaxNormalizeTensor from "./tensor_min_max_normalize";
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
  loss: number;
  startTimestamp: number;
  endTimestamp: number | null;
}

export interface Progress {
  state: "StillTraining" | "Complete";
  totalEpochs: number;

  /**
   * All epochs the training underwent so far. The current epoch is the last item in the array.
   */
  epochs: Epoch[];
}

export function progressPercentage(progress: Progress) {
  if (progress.totalEpochs === 0) return 0;

  return (progress.epochs.length - 1) / progress.totalEpochs;
}

export default class TrainingCycle implements ImperativeObject {
  public readonly uuid: string = generateUUID();
  public readonly estimator: tf.Sequential;
  public readonly numClasses: number;

  public progress: Progress | null;

  constructor(variant: EstimatorVariant, numClasses: number) {
    this.numClasses = 3;
    this.estimator = makeEstimator(variant, 3);
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

    const tX = minMaxNormalizeTensor(tf.tensor2d(X_values));
    const tY = tf.oneHot(tf.tensor1d(y_values_encoded, "int32"), this.numClasses);

    const totalEpochs = 250;

    RunAsync(async (_defer) => {
      await this.estimator.fit(tX, tY, {
        epochs: totalEpochs,
        shuffle: false,
        validationSplit: 0.2,
        batchSize: 32,
        callbacks: {
          onTrainBegin: async (logs) => {
            console.log("📈 Training has started!", logs);

            this.progress = {
              state: "StillTraining",
              totalEpochs,
              epochs: [],
            };

            notifyUpdate(this);
          },
          onTrainEnd: async (logs) => {
            console.log("🏁 Training complete!", logs);

            this.progress!.state = "Complete";

            notifyUpdate(this);
          },
          onEpochBegin: async (epoch) => {
            console.log(`🚀 Starting epoch ${epoch + 1}`);

            if (this.progress) {
              const previous = this.progress.epochs.at(-1) ?? null;
              this.progress.epochs.push({
                accuracy: previous?.accuracy ?? 0,
                loss: previous?.loss ?? 1,
                startTimestamp: Date.now(),
                endTimestamp: null,
              });
            }

            notifyUpdate(this);
          },
          onEpochEnd: async (epoch, logs) => {
            console.log(`✅ Finished epoch ${epoch + 1}`, logs);

            // condição de early-stopping
            if (logs?.val_loss !== undefined && logs.val_loss < 0.05) {
              console.log("🛑 Validation loss is low. Stopping early.");
              this.estimator.stopTraining = true;
            }

            if (this.progress && logs) {
              const current = this.progress.epochs.at(-1)!;

              current.accuracy = logs.val_acc;
              current.loss = logs.val_loss;
              current.endTimestamp = Date.now();
            }

            notifyUpdate(this);
          },
          onBatchEnd: async (batch, logs) => {
            if (batch % 50 === 0) {
              // console.log(`🔄 Batch ${batch} - loss: ${logs?.loss?.toFixed(4)}`, logs);

              if (this.progress && logs) {
                const current = this.progress.epochs.at(-1)!;
                current.endTimestamp = Date.now();
              }
            }

            notifyUpdate(this);
          },
        },
      });

      console.log("Finished training async callback.");
    });

    notifyUpdate(this);
  }

  stop() {
    this.estimator.stopTraining = true;
    notifyUpdate(this);
  }
}
