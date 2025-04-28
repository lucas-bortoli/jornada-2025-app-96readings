import { manifest } from "../../Lib/compass_navigator";
import Inference from "./inference";
import InferenceSetup from "./inference_setup";

export const InferenceSetupWindow = manifest(InferenceSetup, {
  initialTitle: () => "Configurações da Inferência",
  hasAnimation: true,
});

export const InferenceWindow = manifest(Inference, {
  initialTitle: (props) => "Classificação",
  hasAnimation: true,
});
