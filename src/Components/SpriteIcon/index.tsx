import { cn } from "../../Lib/class_names";
import IconQuestion16 from "./Question16.png";
import IconSpinnerArrow16 from "./SpinnerArrow16.png";
import IconPlay16 from "./Play16.png";
import IconPause16 from "./Pause16.png";
import IconStop16 from "./Stop16.png";
import IconUndo16 from "./Undo16.png";
import IconSave16 from "./Save16.png";

const Icons = {
  SpinnerArrow16: [IconSpinnerArrow16, 16],
  Question16: [IconQuestion16, 16],
  Play16: [IconPlay16, 16],
  Pause16: [IconPause16, 16],
  Stop16: [IconStop16, 16],
  Undo16: [IconUndo16, 16],
  Save16: [IconSave16, 16],
} as const;

export type IconName = keyof typeof Icons;

interface SpriteIconProps {
  name: IconName;
  className?: string;
}

export const getIconUrl = (icon: IconName) => Icons[icon][0];

export default function SpriteIcon(props: SpriteIconProps) {
  const icon = Icons[props.name];

  return (
    <img
      src={icon[0]}
      aria-label={props.name}
      className={cn("pointer-events-none aspect-square select-none", props.className)}
      style={{
        fontSize: `${icon[1]}px`,
        height: `${icon[1]}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}
