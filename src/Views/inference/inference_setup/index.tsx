import AppFooter from "../../../Components/AppFooter";
import Button, { IconButton } from "../../../Components/Button";
import ComboBox from "../../../Components/ComboBox";
import ComboBoxOption from "../../../Components/ComboBox/ComboBoxOption";
import { cn } from "../../../Lib/class_names";
import { useWindowing } from "../../../Lib/compass_navigator";
import { InferenceWindow } from "../_windows";
import style from "./style.module.css";

export default function InferenceSetup(props: {}) {
  const windowing = useWindowing();

  function goToInference() {
    windowing.createWindow(InferenceWindow, {});
  }

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
        <ComboBox className="max-w-96" onChange={() => {}} value="">
          <ComboBoxOption kind="option" value="Ensaio 0">
            ensaio 0-mini
          </ComboBoxOption>
        </ComboBox>
        <h2 className="my-2 text-sm">Informações sobre o estimador selecionado</h2>
        <ul className={cn("ml-5 list-disc", style.model_info_list)}>
          <li>
            Complexidade <strong>mini</strong>
          </li>
          <li>
            Treinado com <strong>3 substâncias</strong>
          </li>
        </ul>
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
