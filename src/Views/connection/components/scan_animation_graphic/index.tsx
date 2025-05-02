import { cn } from "../../../../Lib/class_names";
import doSwitch from "../../../../Lib/switch_expression";
import style from "./style.module.css";

export default function ScanAnimationGraphic(props: {
  className?: string;
  connectionState: "NotConnected" | "Connecting" | "Connected";
}) {
  return (
    <div
      className={cn(
        style.visual2,
        doSwitch(props.connectionState, {
          NotConnected: "",
          Connecting: style.connecting,
          Connected: style.connected,
        }),
        props.className
      )}
    />
  );
}
