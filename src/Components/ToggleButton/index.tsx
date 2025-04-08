import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../Lib/class_names";
import style from "./style.module.css";

export interface ToggleButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  checked: boolean;
}

export default function ToggleButton(props: ToggleButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "disabled:text-grey-400 enabled: inline-flex h-10 items-center gap-4 border px-4 py-2 font-serif select-none disabled:border-none disabled:shadow-none",
        !props.checked &&
          "bg-grey-0 hover:shadow-pixel-sm active:bg-grey-50 border-grey-800 text-grey-800 shadow-pixel active:translate-x-px active:translate-y-px active:shadow-none",
        props.checked && "bg-grey-300 translate-x-px translate-y-px font-semibold",
        style.button,
        props.className
      )}>
      {props.children}
    </button>
  );
}
