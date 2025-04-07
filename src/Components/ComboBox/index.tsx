import { cn } from "../../Lib/class_names";
import { getIconUrl } from "../SpriteIcon";
import style from "./style.module.css";
import { PropsWithChildren } from "react";

interface ComboBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  className?: string;
  children?: PropsWithChildren["children"];
  comboboxSize?: "small" | "normal";
}

export default function ComboBox(props: ComboBoxProps) {
  const size = props.comboboxSize ?? "normal";

  return (
    <select
      disabled={props.disabled ?? false}
      className={cn(
        "border-grey-600 bg-grey-0 text-grey-800 shadow-pixel placeholder:text-grey-400 hover:shadow-pixel-sm disabled:bg-grey-100 disabled:text-grey-600 inline-flex appearance-none items-center border font-sans select-none disabled:shadow-none",
        size === "normal" && "h-10 gap-2 px-2 pr-8",
        size === "small" && "h-6 px-1 pr-6 text-sm",
        style.combobox,
        props.className
      )}
      style={{
        "--icon-url": `url('${getIconUrl("DropdownArrow16")}')`,
        "--icon-margin-right": size === "small" ? "4px" : "",
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}>
      {props.children}
    </select>
  );
}
