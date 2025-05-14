import About from ".";
import { manifest } from "../../Lib/compass_navigator";

export const AboutWindow = manifest(About, {
  initialTitle: () => "Sobre o Aplicativo",
  hasAnimation: true,
});
