import { useState } from "react";
import useAlert from "../../Components/AlertDialog";
import AppFooter from "../../Components/AppFooter";
import { IconButton } from "../../Components/Button";
import TextField from "../../Components/TextField";
import { manifest, useWindowing } from "../../Lib/compass_navigator";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";

export default function NewClassRegisterView() {
  const windowing = useWindowing();
  const showAlert = useAlert();

  const [className, setClassName] = useState("");

  const currentWindow = useProvideCurrentWindow({
    title: "Criação de classe",
    hasAnimation: true,
    backButtonHandler: () => {
      return "DisposeCurrentWindow";
    },
  });

  //useCurrentWindowBackButton(async (currentWindowKey) => {
  //  const choice = await showAlert({
  //    title: "Cancelar criação de classe?",
  //    content: <p>Você perderá todos os dados coletados neste formulário!</p>,
  //    buttons: { cancel: "Voltar", confirm: "Confirmar" },
  //  });
  //  if (choice === "cancel") return;
  //  setTimeout(() => {
  //    windowing.removeSpecificWindow(currentWindowKey);
  //  }, 300);
  //});

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">{currentWindow?.title}</h1>
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
      <section className="mx-4 flex flex-col items-stretch gap-2">
        <section className="flex flex-col items-center gap-2">
          <div className="flex w-72 justify-center gap-2">
            <div className="flex grow basis-0 flex-col items-center gap-2 text-center">
              <span>Dados salvos</span>
              <div className="shadow-inset-pixel-xl bg-grey-200 relative my-auto aspect-square w-36 rounded-full border-2">
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-2">
                  <span className="text-2xl">10000</span>
                  <br />
                  <span>entradas</span>
                </p>
              </div>
            </div>
            <div className="flex grow basis-0 flex-col items-center gap-2 text-center">
              <span>Dados novos</span>
              <div className="shadow-inset-pixel-md bg-grey-200 relative my-auto aspect-square w-24 rounded-full border-2">
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-2">
                  <span>500</span>
                  <br />
                  <span className="text-sm">entradas</span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <IconButton iconName="Play16" className="mr-4" />
            <IconButton iconName="Undo16" disabled />
            <IconButton iconName="Save16" disabled />
          </div>
          <span className="text-sm">Use os controles acima para coletar dados.</span>
        </section>
      </section>
      <AppFooter />
    </main>
  );
}

export const NewClassRegisterWindow = manifest(NewClassRegisterView, {
  hasAnimation: () => true,
  initialTitle: () => "Criar nova classe",
});
