import { manifest } from "../../Lib/compass_navigator";
import NewEstimatorPage from "./setup_form";
import Training from "./training";

export const NewEstimatorPageWindow = manifest(NewEstimatorPage, {
  initialTitle: () => "Novo Estimador",
  hasAnimation: true,
});

export const TrainingWindow = manifest(Training, {
  initialTitle: () => "Treinamento",
  hasAnimation: true,
});
