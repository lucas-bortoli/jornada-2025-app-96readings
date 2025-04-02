import { cn } from "../../Lib/class_names";
import IconQuestion16 from "./Question16.png";
import IconSpinnerArrow16 from "./SpinnerArrow16.png";

const Icons = {
  SpinnerArrow16: [IconSpinnerArrow16, 16],
  Question16: [IconQuestion16, 16],
} as const;

type IconName = keyof typeof Icons;

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
