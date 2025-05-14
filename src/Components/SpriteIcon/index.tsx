import { cn } from "../../Lib/class_names";
import IconCheck16 from "./Check16.png";
import IconDropdownArrow16 from "./DropdownArrow16.png";
import IconPause16 from "./Pause16.png";
import IconPlay16 from "./Play16.png";
import IconQuestion16 from "./Question16.png";
import IconRadioButtonFilled16 from "./RadioButtonFilled16.png";
import IconSave16 from "./Save16.png";
import IconSpinnerArrow16 from "./SpinnerArrow16.png";
import IconStop16 from "./Stop16.png";
import IconUndo16 from "./Undo16.png";
import IconDelete16 from "./Delete16.png";
import IconEdit16 from "./Edit16.png";
import IconRename16 from "./Rename16.png";
import IconSearch16 from "./Search16.png";
import IconAddDirectory16 from "./AddDirectory16.png";
import IconSensorReading16 from "./SensorReading16.png";
import IconEgg512 from "./Egg512.png";
import IconEgg256 from "./Egg256.png";
import { CSSProperties } from "react";

const Icons = {
  SpinnerArrow16: [IconSpinnerArrow16, 16],
  Question16: [IconQuestion16, 16],
  Play16: [IconPlay16, 16],
  Pause16: [IconPause16, 16],
  Stop16: [IconStop16, 16],
  Undo16: [IconUndo16, 16],
  Save16: [IconSave16, 16],
  Check16: [IconCheck16, 16],
  DropdownArrow16: [IconDropdownArrow16, 16],
  RadioButtonFilled16: [IconRadioButtonFilled16, 16],
  Delete16: [IconDelete16, 16],
  Edit16: [IconEdit16, 16],
  Rename16: [IconRename16, 16],
  Search16: [IconSearch16, 16],
  AddDirectory16: [IconAddDirectory16, 16],
  SensorReading16: [IconSensorReading16, 16],
  Egg512: [IconEgg512, 512],
  Egg256: [IconEgg256, 256],
} as const;

export type IconName = keyof typeof Icons;

interface SpriteIconProps {
  name: IconName;
  className?: string;
  style?: CSSProperties;
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
        ...props.style,
      }}
    />
  );
}
