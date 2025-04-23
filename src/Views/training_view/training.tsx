import { useEffect, useRef } from "react";
import useAlert from "../../Components/AlertDialog";
import { useToast } from "../../Components/Toast";
import { EstimatorVariant } from "../../Estimator/training/model_templates";
import TrainingCycle, { progressPercentage } from "../../Estimator/training_cycle";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import delay from "../../Lib/delay";
import useImperativeObject from "../../Lib/imperative_object";
import Run, { RunAsync } from "../../Lib/run";
import useAbortSignal from "../../Lib/use_abort_signal";

interface TrainingProps {
  variant: EstimatorVariant;
  numClasses: number;
}

export default function Training(props: TrainingProps) {
  const showAlert = useAlert();
  const showToast = useToast();

  const training = useImperativeObject(() => new TrainingCycle(props.variant, props.numClasses));

  const pageAbortSignal = useAbortSignal();

  useEffect(() => {
    RunAsync(async () => {
      await delay(500);

      if (pageAbortSignal.aborted) return;
      showToast({
        content: "Iniciando treinamento...",
        duration: "long",
      });

      await delay(500);

      if (pageAbortSignal.aborted) return;
      training.startTraining([
        [0, 0.8, 0, 0, 0, "air"],
        [0, 0.8, 0, 0, 0, "air"],
        [0, 0.8, 0, 0, 0, "air"],
        [0, 0.8, 0, 0, 0, "air"],
        [0, -0.4, 0, 0, 0, "coffee"],
        [0, 0.8, 0, 0, 0, "air"],
        [0, -0.4, 0, 0, 0, "coffee"],
        [0, -0.4, 0, 0, 0, "coffee"],
        [0, 0.8, 0, 0, 0, "air"],
        [0, -0.4, 0, 0, 0, "coffee"],
      ]);

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
              <h1 className="text-6xl">{progressPercentage(training.progress)}%</h1>
              <p>
                Época {training.progress.epochs.length} de {training.progress.totalEpochs}
              </p>
              <section className="bg-grey-50 border-grey-800 shadow-pixel-sm flex w-3/4 max-w-sm flex-col gap-2 border p-4">
                <table>
                  <tbody>
                    <tr>
                      <td>Tempo total</td>
                      <td className="text-end">2min, 10s</td>
                    </tr>
                    <tr>
                      <td>Loss</td>
                      <td className="text-end font-mono text-lg">0.432</td>
                    </tr>
                    <tr>
                      <td>Acurácia</td>
                      <td className="text-end font-mono text-lg">0.210</td>
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
