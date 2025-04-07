import { cn } from "../../Lib/class_names";
import { getIconUrl } from "../SpriteIcon";

interface CheckboxProps {
  className?: string;
  disabled?: boolean;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      disabled={props.disabled}
      checked={props.checked}
      onChange={(e) => props.onCheck(e.currentTarget.checked)}
      className={cn(
        "border-grey-800 bg-grey-200 shadow-pixel disabled:bg-grey-400 h-4 w-4 shrink-0 appearance-none border bg-center",
        props.className
      )}
      style={{
        backgroundImage: props.checked ? `url('${getIconUrl("Check16")}')` : "none",
        imageRendering: "pixelated",
      }}
    />
  );
}
