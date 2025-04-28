import * as tf from "@tensorflow/tfjs";

/**
 * Normalizes a 2D tensor to have values in the range [0, 1] for each column.
 *
 * This function performs min-max normalization, which scales the tensor such that
 * the minimum value in each column becomes 0 and the maximum value becomes 1.
 *
 * @param tensor - The input 2D tensor to be normalized.
 * @return - The normalized 2D tensor.
 */
export default function minMaxNormalizeTensor(tensor: tf.Tensor2D): tf.Tensor2D {
  const minTensor = tensor.min(0); // ...min per column
  const maxTensor = tensor.max(0); // ...max per column
  const rangeTensor = maxTensor.sub(minTensor);
  return tensor.sub(minTensor).div(rangeTensor);
}
