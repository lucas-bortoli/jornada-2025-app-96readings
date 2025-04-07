import { getIconUrl } from "./SpriteIcon";

interface RadioButtonProps {
  disabled?: boolean;
  checked: boolean;
  onCheck: () => void;
}

export default function RadioButton(props: RadioButtonProps) {
  return (
    <input
      type="radio"
      disabled={props.disabled}
      checked={props.checked}
      onChange={props.onCheck}
      className="border-grey-800 bg-grey-200 shadow-pixel disabled:bg-grey-400 h-4 w-4 appearance-none border bg-center"
      style={{
        backgroundImage: props.checked ? `url('${getIconUrl("RadioButtonFilled16")}')` : "none",
        imageRendering: "pixelated",
      }}
    />
  );
}
