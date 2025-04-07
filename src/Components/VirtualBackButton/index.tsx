import { useBackButtonTrigger } from "../../Lib/back_button";
import SvgIcon from "../SvgIcon";

interface VirtualBackButtonProps {
  className?: string;
  disabled?: boolean;
}

export default function VirtualBackButton(props: VirtualBackButtonProps) {
  const trigger = useBackButtonTrigger();

  return (
    <button onClick={trigger} disabled={props.disabled} className={props.className}>
      <SvgIcon icon="ArrowBack" className="!h-6" />
    </button>
  );
}
