import NewClassRegisterView from ".";
import { manifest } from "../../Lib/compass_navigator";

export const NewClassRegisterWindow = manifest(NewClassRegisterView, {
  initialTitle: () => "Criar nova classe",
  hasAnimation: true,
});
