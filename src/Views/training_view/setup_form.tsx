import { motion } from "framer-motion";
import { useState } from "react";
import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import TextField from "../../Components/TextField";
import { useToast } from "../../Components/Toast";
import ToggleButton from "../../Components/ToggleButton";
import { EstimatorVariant } from "../../Estimator/training/model_templates";
import { cn } from "../../Lib/class_names";
import { useWindowing } from "../../Lib/compass_navigator";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import generateFriendlyName from "../../Lib/friendly_name_generator";
import Run from "../../Lib/run";
import doSwitch from "../../Lib/switch_expression";
import { useStateSet } from "../../Lib/use_map_set";
import useSort from "../../Lib/use_sort";
import useUpdateEffect from "../../Lib/use_update_effect";
import { CategoryID, getAllCategories } from "../../Storage";
import { useStorageQuery } from "../../Storage/use_storage";
import { TrainingWindow } from "./windows";

export default function NewEstimatorPage() {
  const showToast = useToast();
  const windowing = useWindowing();
  const [modelName, setModelName] = useState(generateFriendlyName());
  const [selectedClasses, mutateSelectedClasses] = useStateSet<CategoryID>(() => new Set([]));

  const storageCategories = useStorageQuery(getAllCategories, []) ?? [];

  const sorter = useSort({
    subjects: storageCategories,
    map: {
      byDatapointCount: (category) =>
        category.sessions.reduce((acc, s) => acc + s.datapoints.length, 0),
    },
    initialMethod: "byDatapointCount",
    initialReversed: false,
  });

  useProvideCurrentWindow({
    title: ["Novo Estimador", `${selectedClasses} classes selecionadas`].join(" - "),
  });

  function toggleTrainingClass(categoryId: CategoryID) {
    mutateSelectedClasses.toggle(categoryId);
    if (selectedClasses.has(categoryId)) {
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
      friendlyName: modelName,
      variant: doSwitch(networkSize, {
        0: "mini",
        1: "small",
        2: "medium",
        3: "large",
      }) satisfies EstimatorVariant,
      categories: [...selectedClasses].map((id) => storageCategories.find((c) => c.id === id)!),
    });
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <section className="mx-4 flex flex-col items-stretch">
        <span>Qual é o nome dessa classe?</span>
        <TextField
          kind="text"
          value={modelName}
          onInput={setModelName}
          placeholder="Nome da classe..."
        />
      </section>
      <section>
        <span className="mx-4">Minhas categorias</span>
        <ul className="flex h-48 w-full gap-2 overflow-x-scroll pb-2 before:mr-2 after:ml-2">
          {sorter.sorted.map((category) => (
            <motion.li
              key={category.id}
              className={cn(
                "border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border p-2",
                !selectedClasses.has(category.id) && "shadow-pixel-sm bg-white",
                selectedClasses.has(category.id) &&
                  "bg-grey-100 translate-x-px translate-y-px shadow-none"
              )}
              onClick={toggleTrainingClass.bind(null, category.id)}>
              <h3 className="text-lg leading-4 font-semibold">{category.friendly_name}</h3>
              <span className="text-sm leading-4">
                {category.sessions.reduce((acc, c) => acc + c.datapoints.length, 0)} amostras
              </span>
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
