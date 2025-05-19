import { useEffect, useMemo, useRef } from "react";
import useAlert from "../../Components/AlertDialog";
import { useToast } from "../../Components/Toast";
import { EstimatorVariant } from "../../Estimator/training/model_templates";
import TrainingCycle from "../../Estimator/training_cycle";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import delay from "../../Lib/delay";
import { useMiniGBusSubscription } from "../../Lib/gbus_mini";
import useObjectSubscription from "../../Lib/imperative_object";
import Run, { RunAsync } from "../../Lib/run";
import useAbortSignal from "../../Lib/use_abort_signal";
import useKeepAwake from "../../Lib/use_keep_awake";
import * as storage from "../../Storage";
import { Category } from "../../Storage";
import Percentage from "./components/percentage";
import TimeProgress from "./components/time_progress";

interface TrainingProps {
  friendlyName: string;
  variant: EstimatorVariant;
  categories: Category[];
}

export default function Training(props: TrainingProps) {
  const showAlert = useAlert();
  const showToast = useToast();

  const training = useObjectSubscription(
    useMemo(() => new TrainingCycle(props.variant, props.categories), [])
  );
  const pageAbortSignal = useAbortSignal();

  //@ts-expect-error
  window.training = training;

  useKeepAwake();

  useEffect(() => {
    RunAsync(async () => {
      await delay(500);

      if (pageAbortSignal.aborted) return;
      showToast({
        content: "Iniciando treinamento...",
        duration: "long",
      });

      if (pageAbortSignal.aborted) return;
      training.startTraining();

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

  useMiniGBusSubscription("trainingComplete", async (event) => {
    if (event.objectUUID !== training.uuid) return;

    // salvar estimador
    await storage.createModel({
      size_class: props.variant,
      friendly_name: props.friendlyName,
      categories: props.categories,
      data: {
        model: training.estimator.toJSON(null, false) as object,
        scaler: training.scaler.toJSON(),
        encoder: training.encoder.toJSON(),
      },
    });

    showAlert({
      title: "Treinamento concluído",
      content: <p>O estimador foi treinado com sucesso.</p>,
      buttons: { ok: "OK" },
    });
  });

  const isHandlingBackButton = useRef(false);
  useProvideCurrentWindow({
    backButtonHandler: async (killThisWindow) => {
      if (isHandlingBackButton.current) return;

      if (training.progress?.state === "Complete") {
        return killThisWindow();
      }

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
              <Percentage progress={training.progress} className="text-6xl" />
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
