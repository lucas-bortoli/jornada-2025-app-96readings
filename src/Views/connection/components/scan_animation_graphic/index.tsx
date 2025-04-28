import { cn } from "../../../../Lib/class_names";
import style from "./style.module.css";

export default function ScanAnimationGraphic(props: { className?: string }) {
  return <div className={cn(style.visual2, props.className)} />;
}
