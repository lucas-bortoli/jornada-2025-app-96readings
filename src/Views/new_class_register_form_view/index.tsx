import { useState } from "react";
import useAlert from "../../Components/AlertDialog";
import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import HelpTip from "../../Components/HelpTip";
import TextField from "../../Components/TextField";
import { useWindowing } from "../../Lib/compass_navigator";
import useBackButton from "../../Lib/compass_navigator/use_back_button";
import useCurrentWindowKey from "../../Lib/compass_navigator/window_container/current_window_key_context";

export default function NewClassRegisterView() {
  const windowing = useWindowing();
  const currentWindowKey = useCurrentWindowKey();
  const showAlert = useAlert();

  const [className, setClassName] = useState("");

  useBackButton(async () => {
    if (windowing.windows.at(-1)?.key !== currentWindowKey) return;

    const choice = await showAlert({
      title: "Cancelar criação de classe?",
      content: <p>Você perderá todos os dados coletados neste formulário!</p>,
      buttons: { cancel: "Voltar", confirm: "Confirmar" },
    });
    if (choice === "cancel") return;
    setTimeout(() => {
      windowing.removeSpecificWindow(currentWindowKey);
    }, 300);
  });

  return (
    <main className="relative flex h-full w-full flex-col gap-4 overflow-y-scroll bg-white font-serif">
      <nav className="border-grey-800 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b bg-white p-4">
        <h1 className="text-xl">Criar nova classe</h1>
      </nav>
      <section className="mx-4 flex flex-col items-stretch">
        <span>Qual será o nome dessa classe?</span>
        <TextField
          kind="text"
          value={className}
          onInput={setClassName}
          placeholder="Nome da classe..."
        />
      </section>
      <section className="mx-4 flex flex-col items-stretch">
        <div className="flex items-center justify-between">
          <span>Dados representativos da classe</span>
          <HelpTip title="O que são dados representativos?">
            Dados representativos de uma classe são aqueles que refletem com precisão as
            características essenciais do grupo ao qual pertencem. Eles devem abranger a diversidade
            de elementos dentro da classe, garantindo que qualquer análise, modelo estatístico ou
            algoritmo de inteligência artificial que os utilize possa fazer previsões ou
            classificações corretas.
          </HelpTip>
        </div>
      </section>
      <section className="flex justify-end px-4">
        <Button>Treinar</Button>
      </section>
      <AppFooter />
    </main>
  );
}
