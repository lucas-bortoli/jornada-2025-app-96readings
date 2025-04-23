import * as tf from "@tensorflow/tfjs";
import LabelEncoder from "./label_encoder";
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
window.LabelEncoder = LabelEncoder;
//@ts-expect-error
window.trainTestSplit = trainTestSplit;
//@ts-expect-error
window.shuffleArray = shuffleArray;
//@ts-expect-error
window.tf = tf;
