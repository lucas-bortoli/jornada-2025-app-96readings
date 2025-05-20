import { useState } from "react";
import AppFooter from "../../../Components/AppFooter";
import { IconButton } from "../../../Components/Button";
import ComboBox from "../../../Components/ComboBox";
import ComboBoxOption from "../../../Components/ComboBox/ComboBoxOption";
import { useToast } from "../../../Components/Toast";
import { cn } from "../../../Lib/class_names";
import { useWindowing } from "../../../Lib/compass_navigator";
import doSwitch from "../../../Lib/switch_expression";
import { listModels, ModelID } from "../../../Storage";
import { useStorageQuery } from "../../../Storage/use_storage";
import { InferenceWindow } from "../_windows";
import style from "./style.module.css";

export default function InferenceSetup(_props: {}) {
  const windowing = useWindowing();
  const models = useStorageQuery(() => listModels(), []) ?? [];
  const [pickedModelId, setPickedModelId] = useState<ModelID | null>(null);
  const showToast = useToast();

  function goToInference() {
    if (pickedModelId === null) {
      return showToast({ content: "É preciso escolher um modelo!", duration: "short" });
    }

    const model = models.find((m) => m.id === pickedModelId) ?? null;

    if (model === null) {
      return showToast({ content: "Erro: O modelo não existe.", duration: "short" });
    }

    windowing.createWindow(InferenceWindow, { model });
  }

  const pickedModel = models.find((m) => m.id === pickedModelId) ?? null;

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Classificação</h1>
      </nav>
      <p className="mx-4">
        Escolha um dos estimadores treinados anteriormente para a análise dos dados do sensor.
      </p>
      <section className="border-grey-600 bg-grey-200 mx-4 flex flex-col border border-l-4 p-4">
        <h2>Meus estimadores</h2>
        <ComboBox className="max-w-96" onChange={setPickedModelId} value={pickedModelId ?? ""}>
          <ComboBoxOption kind="option" value="">
            {" "}
          </ComboBoxOption>
          {models.map((model) => {
            return (
              <ComboBoxOption key={model.id} kind="option" value={model.id}>
                {`${model.friendly_name} (${model.size_class})`}
              </ComboBoxOption>
            );
          })}
        </ComboBox>
        {pickedModel && (
          <>
            <h2 className="my-2 text-sm">Informações sobre o estimador selecionado</h2>
            <ul className={cn("ml-5 list-disc", style.model_info_list)}>
              <li>
                {
                  //prettier-ignore
                  doSwitch(pickedModel.size_class, {
                    mini: <>Complexidade <strong>mini</strong></>,
                    small: <><strong>Pequena</strong> complexidade</>,
                    medium: <><strong>Média</strong> complexidade</>,
                    large: <><strong>Grande</strong> complexidade</>,
                  })
                }
              </li>
              <li>
                Treinado com{" "}
                <strong>
                  {pickedModel.categories.length}{" "}
                  {pickedModel.categories.length === 1 ? "substância" : "substâncias"}
                </strong>
              </li>
            </ul>
          </>
        )}
      </section>
      <section className="flex justify-end px-4">
        <IconButton iconName="SensorReading16" onClick={goToInference}>
          Iniciar classificação
        </IconButton>
      </section>
      <AppFooter />
    </main>
  );
}
