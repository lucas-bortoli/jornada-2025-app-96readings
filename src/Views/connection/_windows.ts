import { manifest } from "../../Lib/compass_navigator";
import Connection from "./connection";

export const ConnectionWindow = manifest(Connection, {
  initialTitle: () => "Connection Popup",
  hasAnimation: false,
});
