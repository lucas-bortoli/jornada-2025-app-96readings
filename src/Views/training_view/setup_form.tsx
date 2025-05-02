import { motion } from "framer-motion";
import { useState } from "react";
import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import { useToast } from "../../Components/Toast";
import ToggleButton from "../../Components/ToggleButton";
import { EstimatorVariant } from "../../Estimator/training/model_templates";
import { cn } from "../../Lib/class_names";
import { useWindowing } from "../../Lib/compass_navigator";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import Run from "../../Lib/run";
import doSwitch from "../../Lib/switch_expression";
import { useStateSet } from "../../Lib/use_map_set";
import useUpdateEffect from "../../Lib/use_update_effect";
import { NewClassRegisterWindow } from "../new_class_register_form_view/_windows";
import { TrainingWindow } from "./windows";

export default function NewEstimatorPage() {
  const showToast = useToast();
  const windowing = useWindowing();
  const [selectedClasses, mutateSelectedClasses] = useStateSet<number>(() => new Set([1]));

  useProvideCurrentWindow({
    title: ["Novo Estimador", `${selectedClasses} classes selecionadas`].join(" - "),
  });

  function openCreateNewClassPage() {
    windowing.createWindow(NewClassRegisterWindow, {});
  }

  function toggleTrainingClass(card: number) {
    mutateSelectedClasses.toggle(card);
    if (selectedClasses.has(card)) {
      showToast({
        content: "A classe será incluída no treinamento.",
        duration: "shortest",
      });
    } else {
      showToast({
        content: "A classe será excluída no treinamento.",
        duration: "shortest",
      });
    }
  }

  const [networkSize, setNetworkSize] = useState<0 | 1 | 2 | 3>(2);

  useUpdateEffect(() => {
    showToast({
      content: "Complexidade da rede alterada.",
      duration: "shortest",
    });
  }, [networkSize]);

  function startTraining() {
    if (selectedClasses.size < 2) {
      return showToast({
        content: "É preciso selecionar pelo menos duas classes para o modelo.",
        duration: "shortest",
      });
    }

    windowing.createWindow(TrainingWindow, {
      variant: doSwitch(networkSize, {
        0: "mini",
        1: "small",
        2: "medium",
        3: "large",
      }) satisfies EstimatorVariant,
      numClasses: selectedClasses.size,
    });
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <section>
        <span className="mx-4">Minhas classes</span>
        <ul className="flex h-40 w-full gap-2 overflow-x-scroll py-2 before:mr-2 after:ml-2">
          <motion.li
            key="new_class"
            whileTap={{ scale: 1.05 }}
            className="shadow-pixel-sm border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border bg-white p-2"
            onClick={openCreateNewClassPage}>
            <h3 className="text-lg leading-4 font-semibold">Nova classe</h3>
            <span className="text-sm leading-4">Coletar amostras</span>
          </motion.li>
          {[0, 1, 2, 3].map((card) => (
            <motion.li
              key={card}
              className={cn(
                "border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border p-2",
                !selectedClasses.has(card) && "shadow-pixel-sm bg-white",
                selectedClasses.has(card) && "bg-grey-100 translate-x-px translate-y-px shadow-none"
              )}
              onClick={toggleTrainingClass.bind(null, card)}>
              <h3 className="text-lg leading-4 font-semibold">Classe</h3>
              <span className="text-sm leading-4">3 amostras</span>
            </motion.li>
          ))}
        </ul>
      </section>
      <section>
        <header className="flex items-center">
          <span className="mx-4">Complexidade da Rede</span>
        </header>
        <div className="flex gap-2 px-4">
          <div className="flex max-w-sm grow flex-col">
            <ToggleButton
              className="justify-center"
              checked={networkSize === 0}
              onClick={setNetworkSize.bind(null, 0)}>
              Mini
            </ToggleButton>
            <ToggleButton
              className="justify-center"
              checked={networkSize === 1}
              onClick={setNetworkSize.bind(null, 1)}>
              Pequena
            </ToggleButton>
            <ToggleButton
              className="justify-center"
              checked={networkSize === 2}
              onClick={setNetworkSize.bind(null, 2)}>
              Média
            </ToggleButton>
            <ToggleButton
              className="justify-center"
              checked={networkSize === 3}
              onClick={setNetworkSize.bind(null, 3)}>
              Grande
            </ToggleButton>
          </div>
          <div className="relative h-40 w-40">
            {[0.1, 0.3, 0.6, 1].map((scale) => (
              <div
                key={scale}
                className="border-grey-500 absolute top-1/2 left-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2 border border-dashed"
                style={{ scale }}
              />
            ))}
            {Run(() => {
              const scale = doSwitch(networkSize, {
                [0]: 0.1,
                [1]: 0.3,
                [2]: 0.6,
                [3]: 1,
              });
              return (
                <motion.i
                  initial={{ scale: 0 }}
                  animate={{
                    scale: scale,
                    transition: { type: "spring", duration: 0.5 },
                  }}
                  className="bg-grey-500 shadow-pixel-sm absolute top-1/2 left-1/2 flex aspect-square h-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  Estimador
                </motion.i>
              );
            })}
          </div>
        </div>
      </section>
      <section className="flex justify-end px-4">
        <Button onClick={startTraining}>Iniciar treinamento</Button>
      </section>
      <AppFooter />
    </main>
  );
}
