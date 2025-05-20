import { useEffect, useMemo } from "react";
import CInference from "../../../Estimator/inference";
import { cn } from "../../../Lib/class_names";
import useObjectSubscription from "../../../Lib/imperative_object";
import useKeepAwake from "../../../Lib/use_keep_awake";
import { Model } from "../../../Storage";
import style from "./style.module.css";

interface InferenceProps {
  model: Model;
}

export default function Inference(props: InferenceProps) {
  useKeepAwake();

  const inference = useObjectSubscription(
    useMemo(() => new CInference(props.model), [props.model])
  );

  useEffect(() => {
    inference.init();
  }, []);

  const mostProbable = inference.latestPrediction?.toSorted((a, b) => b[1] - a[1]).at(0) ?? null;

  return (
    <div className="bg-grey-100 flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-1 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Classificação</h1>
      </nav>
      <section className="relative my-8 h-36 w-full shrink-0">
        <div
          className={cn(
            "shadow-pixel-sm bg-grey-500 flex items-center justify-center border",
            style.square
          )}>
          Estimador
        </div>
      </section>
      {mostProbable && (
        <section className="mx-4 flex flex-col items-center">
          <h1 className="text-4xl">{mostProbable[0].friendly_name}</h1>
          <span>{(mostProbable[1] * 100).toFixed(1)}%</span>
        </section>
      )}

      <section className="bg-grey-50 border-grey-800 shadow-pixel-sm mx-auto flex w-3/4 max-w-sm flex-col gap-2 border p-4">
        <table>
          <tbody>
            {(inference.latestPrediction ?? []).map(([category, prob]) => (
              <tr key={category.id}>
                <td>{category.friendly_name}</td>
                <td className="text-end font-mono text-lg">{(prob * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
