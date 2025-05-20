import * as tf from "@tensorflow/tfjs";
import { gbus } from "../../Lib/gbus_mini";
import { ImperativeObject, makeObjectUUID, notifyUpdate } from "../../Lib/imperative_object";
import { Category, CategoryID, Model } from "../../Storage";
import LabelEncoder from "../label_encoder";
import { loadModel } from "../serialization";
import MinMaxScaler from "../tensor_min_max_normalize";

type Prediction = [Category, number][];

export default class Inference implements ImperativeObject {
  public readonly uuid = makeObjectUUID();
  public readonly model: Model;
  private readonly categoryLookup: Map<CategoryID, Category>;

  public state: "Stopped" | "Loading" | "Active";
  public estimator: tf.LayersModel | null;
  public scaler: MinMaxScaler | null;
  public encoder: LabelEncoder | null;
  public dataChannelSubscription: number | null;
  public latestPrediction: Prediction | null;

  constructor(model: Model) {
    this.model = model;
    this.state = "Stopped";
    this.estimator = null;
    this.scaler = null;
    this.encoder = null;
    this.dataChannelSubscription = null;
    this.latestPrediction = null;

    this.categoryLookup = new Map();
    for (const cat of model.categories) {
      this.categoryLookup.set(cat.id, cat);
    }
  }

  public async init() {
    if (this.state !== "Stopped") return;

    this.state = "Loading";
    notifyUpdate(this);

    this.estimator = await loadModel(this.model.data.model);
    this.scaler = MinMaxScaler.fromJSON(this.model.data.scaler);
    this.encoder = LabelEncoder.fromJSON(this.model.data.encoder);

    if (this.dataChannelSubscription !== null) {
      gbus.unsubscribe(this.dataChannelSubscription);
    }
    this.dataChannelSubscription = gbus.subscribe(
      "bluetoothSensorData",
      this.onBluetoothData.bind(this)
    );

    this.state = "Active";
    notifyUpdate(this);
  }

  private async onBluetoothData(datapoint: Uint32Array) {
    if (this.state !== "Active") return;

    const X = tf.tensor2d([[datapoint[0], datapoint[1], datapoint[2], datapoint[3], datapoint[4]]]); // 1-row dataframe
    const Xscaled = this.scaler!.transform(X);

    const predictionProbs = await (this.estimator!.predict(Xscaled) as tf.Tensor2D).data();

    console.log(predictionProbs[0]);

    const prediction: [CategoryID, number][] = [...predictionProbs].map((prob, idx) => [
      this.encoder!.decodeIntToString(idx),
      prob,
    ]);

    this.latestPrediction = prediction
      .map(([categoryId, prob]) => [this.categoryLookup.get(categoryId) ?? null, prob])
      .filter(([categoryId]) => categoryId !== null) as [Category, number][];

    console.debug(this.latestPrediction);

    notifyUpdate(this);
  }

  onUnmount() {
    if (this.dataChannelSubscription !== null) {
      gbus.unsubscribe(this.dataChannelSubscription);
      this.dataChannelSubscription = null;
    }

    this.estimator = null;
    this.scaler = null;
    this.encoder = null;
    this.state = "Stopped";
  }
}
