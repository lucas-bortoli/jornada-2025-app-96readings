import { ButtonHTMLAttributes, PropsWithChildren, Ref } from "react";
import { cn } from "../../Lib/class_names";
import style from "./style.module.css";

export interface ButtonProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonRef?: Ref<HTMLButtonElement>;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-grey-0 border-grey-800 text-grey-800 shadow-pixel enabled:hover:shadow-pixel-sm enabled:active:bg-grey-50 disabled:text-grey-400 inline-flex h-10 items-center gap-4 border px-4 py-2 font-serif select-none enabled:active:translate-x-px enabled:active:translate-y-px enabled:active:shadow-none disabled:border-none disabled:shadow-none",
        style.button,
        props.className
      )}
      ref={props.buttonRef}>
      {props.children}
    </button>
  );
}
