import { Progress } from "../../../Estimator/training_cycle";

interface PercentageProps {
  progress: Progress;
  className?: string;
}

function progressPercentage(progress: Progress) {
  if (progress.totalEpochs === 0) return 0;

  return (progress.epochs.length - 1) / progress.totalEpochs;
}

export default function Percentage(props: PercentageProps) {
  let percentage = progressPercentage(props.progress);

  if (props.progress.state === "Complete") {
    percentage = 1;
  }

  return <h1 className={props.className}>{(percentage * 100).toFixed(0)}%</h1>;
}
