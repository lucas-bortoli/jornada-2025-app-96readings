import * as tf from "@tensorflow/tfjs";

export interface SerializedModel {
  [key: string]: string;
}

const saveLocation = `localstorage://ModelSerializerKey`;
const localStorageKey = (k: string) => `tensorflowjs_models/ModelSerializerKey/${k}`;

export async function serializeModel(model: tf.LayersModel): Promise<SerializedModel> {
  await model.save(saveLocation);

  const serialized: SerializedModel = {
    info: "",
    model_metadata: "",
    model_topology: "",
    weight_data: "",
    weight_specs: "",
  };

  for (const key of Object.keys(serialized)) {
    serialized[key] = localStorage.getItem(localStorageKey(key))!;
    localStorage.removeItem(localStorageKey(key));
  }

  return serialized;
}

export async function loadModel(serialized: SerializedModel): Promise<tf.LayersModel> {
  for (const key of Object.keys(serialized)) {
    localStorage.setItem(localStorageKey(key), serialized[key]);
  }

  // reload model
  const model = await tf.loadLayersModel(saveLocation);

  // cleanup
  for (const key of Object.keys(serialized)) {
    localStorage.removeItem(localStorageKey(key));
  }

  return model;
}
