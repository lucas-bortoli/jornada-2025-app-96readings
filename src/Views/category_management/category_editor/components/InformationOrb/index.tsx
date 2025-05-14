import { cn } from "../../../../../Lib/class_names";
import style from "./style.module.css";

interface InformationOrbProps {
  size: "small" | "large";
  label: string;
  count: number;
  isAnimated: boolean;
}

export default function InformationOrb(props: InformationOrbProps) {
  return (
    <div className="flex grow basis-0 flex-col items-center gap-2 text-center">
      <span>{props.label}</span>
      <div
        className={cn(
          "shadow-inset-pixel-md bg-grey-200 relative my-auto aspect-square rounded-full border-2",
          props.size === "small" && "w-24",
          props.size === "large" && "w-36",
          props.isAnimated && style.isAnimated
        )}>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-2">
          <span className={cn(props.size === "large" && "text-2xl leading-2")}>{props.count}</span>
          <br />
          <span className="text-sm">entradas</span>
        </p>
      </div>
    </div>
  );
}
