import { ButtonHTMLAttributes, PropsWithChildren, Ref } from "react";
import { cn } from "../../Lib/class_names";
import style from "./style.module.css";
import type { IconName } from "../SpriteIcon";
import SpriteIcon from "../SpriteIcon";
import doSwitch from "../../Lib/switch_expression";

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

export interface IconButtonProps extends ButtonProps {
  iconName: IconName;
  buttonSize?: "small" | "normal";
  children?: string;
}

export function IconButton(props: IconButtonProps) {
  const sizeClass = doSwitch(props.buttonSize ?? "normal", {
    normal: cn("!h-10 !gap-2", !props.children && "!w-8", props.children && "!px-3"),
    small: cn("!h-6 !gap-1", !props.children && "!w-6", props.children && "!px-1"),
  });

  return (
    <Button
      {...props}
      className={cn("inline-flex items-center justify-center !p-0", sizeClass, props.className)}>
      <SpriteIcon name={props.iconName} />
      {props.children}
    </Button>
  );
}
