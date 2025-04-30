import { useEffect, useMemo, useRef } from "react";
import useAlert from "../../Components/AlertDialog";
import { useToast } from "../../Components/Toast";
import { loadSampleDataset } from "../../Estimator";
import { EstimatorVariant } from "../../Estimator/training/model_templates";
import TrainingCycle, { progressPercentage } from "../../Estimator/training_cycle";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import delay from "../../Lib/delay";
import useObjectSubscription from "../../Lib/imperative_object";
import Run, { RunAsync } from "../../Lib/run";
import useAbortSignal from "../../Lib/use_abort_signal";
import useKeepAwake from "../../Lib/use_keep_awake";
import TimeProgress from "./components/time_progress";

interface TrainingProps {
  variant: EstimatorVariant;
  numClasses: number;
}

export default function Training(props: TrainingProps) {
  const showAlert = useAlert();
  const showToast = useToast();

  const training = useObjectSubscription(
    useMemo(() => new TrainingCycle(props.variant, props.numClasses), [])
  );
  const pageAbortSignal = useAbortSignal();

  useKeepAwake();

  useEffect(() => {
    RunAsync(async () => {
      await delay(500);

      if (pageAbortSignal.aborted) return;
      showToast({
        content: "Iniciando treinamento...",
        duration: "long",
      });

      const [dataset] = await Promise.all([loadSampleDataset(), delay(500)]);

      if (pageAbortSignal.aborted) return;
      training.startTraining(dataset);

      while (true) {
        if (pageAbortSignal.aborted) break;

        // ????

        await delay(500);
      }
    });

    return () => {
      training.stop();
    };
  }, [training]);

  const isHandlingBackButton = useRef(false);
  useProvideCurrentWindow({
    backButtonHandler: async (killThisWindow) => {
      if (isHandlingBackButton.current) return;

      const userChoice = await showAlert({
        title: "Parar treinamento?",
        content: <p>Você perderá todo o progresso feito nesse estimador!</p>,
        buttons: { cancel: "Continuar", confirm: "Parar agora" },
      });

      if (userChoice === "cancel") {
        isHandlingBackButton.current = false;
        return;
      }

      killThisWindow();
    },
  });

  return (
    <div className="bg-grey-100 flex h-full w-full flex-col font-serif">
      <nav className="border-grey-800 bg-grey-1 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <div className="relative flex shrink grow flex-col items-center justify-center gap-4 p-4">
        {Run(() => {
          if (training.progress === null) {
            return <h1 className="text-center text-2xl">Iniciando treinamento...</h1>;
          }

          return (
            <>
              <h1 className="text-6xl">
                {(progressPercentage(training.progress) * 100).toFixed(0)}%
              </h1>
              <p>
                Época {training.progress.epochs.length} de {training.progress.totalEpochs}
              </p>
              <section className="bg-grey-50 border-grey-800 shadow-pixel-sm flex w-3/4 max-w-sm flex-col gap-2 border p-4">
                <table>
                  <tbody>
                    <tr>
                      <td>Tempo total</td>
                      <td className="text-end">
                        <TimeProgress
                          startTime={training.progress?.epochs[0]?.startTimestamp}
                          endTime={training.progress.epochs.at(-1)?.endTimestamp}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Loss</td>
                      <td className="text-end font-mono text-lg">
                        {(training.progress?.epochs.at(-1)?.loss ?? 0).toFixed(3)}
                      </td>
                    </tr>
                    <tr>
                      <td>Acurácia</td>
                      <td className="text-end font-mono text-lg">
                        {(training.progress?.epochs.at(-1)?.accuracy ?? 0).toFixed(3)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          );
        })}
      </div>
    </div>
  );
}
