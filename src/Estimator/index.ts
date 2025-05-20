import * as msgpack from "@msgpack/msgpack";
import * as tf from "@tensorflow/tfjs";
import LabelEncoder from "./label_encoder";
import { shuffleArray } from "./rng_awful";
import datasetUrl from "./sample_data.tsv?url";
import * as serializer from "./serialization";
import MinMaxScaler from "./tensor_min_max_normalize";
import trainTestSplit from "./training/train_test_split";

export async function loadSampleDataset() {
  const classWhitelist = new Set(["coffee", "tea", "air"]);

  const dataset = (await (await fetch(datasetUrl)).text())
    .split("\n")
    .slice(1)
    .filter((l) => l.split("\t").length === 6)
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
    )
    .filter((row) => classWhitelist.has(row[5]));

  //@ts-expect-error
  window.dataset = dataset;

  return dataset;
}

//@ts-expect-error
window.LabelEncoder = LabelEncoder;
//@ts-expect-error
window.MinMaxScaler = MinMaxScaler;
//@ts-expect-error
window.trainTestSplit = trainTestSplit;
//@ts-expect-error
window.shuffleArray = shuffleArray;
//@ts-expect-error
window.tf = tf;
//@ts-expect-error
window.serializer = serializer;
//@ts-expect-error
window.msgpack = msgpack;
