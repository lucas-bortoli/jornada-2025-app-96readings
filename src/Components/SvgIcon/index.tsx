import { Ref } from "react";
import { cn } from "../../Lib/class_names";
import IconAccountCircle from "./AccountCircle.svg?react";
import IconBarChart from "./BarChart.svg?react";
import IconExplore from "./Explore.svg?react";
import IconHotelClass from "./HotelClass.svg?react";
import IconSwipeVertical from "./SwipeVertical.svg?react";
import IconChevronRight from "./ChevronRight.svg?react";
import IconTouch from "./Touch.svg?react";
import IconArrowBack from "./ArrowBack.svg?react";
import IconKeyboardArrowUp from "./KeyboardArrowUp.svg?react";
import IconKeyboardArrowDown from "./KeyboardArrowDown.svg?react";
import IconInventory from "./Inventory.svg?react";
import IconStorefront from "./Storefront.svg?react";
import IconForYou from "./ForYou.svg?react";
import IconLock from "./Lock.svg?react";
import IconVolunteerActivism from "./VolunteerActivism.svg?react";

const Icons = {
  Explore: IconExplore,
  AccountCircle: IconAccountCircle,
  BarChart: IconBarChart,
  HotelClass: IconHotelClass,
  SwipeVertical: IconSwipeVertical,
  ChevronRight: IconChevronRight,
  Touch: IconTouch,
  ArrowBack: IconArrowBack,
  KeyboardArrowUp: IconKeyboardArrowUp,
  KeyboardArrowDown: IconKeyboardArrowDown,
  Inventory: IconInventory,
  Storefront: IconStorefront,
  ForYou: IconForYou,
  Lock: IconLock,
  VolunteerActivism: IconVolunteerActivism,
} as const;

export type SvgIconName = keyof typeof Icons;

interface SvgIconProps {
  icon: SvgIconName;
  className?: string;
  ref?: Ref<SVGSVGElement>;
}

export default function SvgIcon(props: SvgIconProps) {
  const IconComponent = Icons[props.icon];

  return (
    <IconComponent
      height={undefined}
      width={undefined}
      fill="currentColor"
      className={cn("h-full", props.className)}
      ref={props.ref}
    />
  );
}
