import { useRef, useState } from "react";
import useAlert from "../../Components/AlertDialog";
import AppFooter from "../../Components/AppFooter";
import { IconButton } from "../../Components/Button";
import TextField from "../../Components/TextField";
import { useToast } from "../../Components/Toast";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import useUpdateEffect from "../../Lib/use_update_effect";
import InformationOrb from "./components/InformationOrb";
import useDataCollection from "./hooks/useDataCollection";

export default function NewClassRegisterView() {
  const showAlert = useAlert();
  const showToast = useToast();

  const [className, setClassName] = useState("");

  const dataCollection = useDataCollection();

  const isHandlingBack = useRef(false);
  const currentWindow = useProvideCurrentWindow({
    title: "Criação de classe",
    backButtonHandler: (killThisWindow) => {
      if (isHandlingBack.current) return;

      if (dataCollection.stagingData.length > 0) {
        showToast({
          content: "Há dados não salvos! Clique no botão de salvar ou de descartar dados.",
          duration: "short",
        });
        return;
      }

      showAlert({
        title: "Cancelar criação de classe?",
        content: <p>Você perderá todos os dados coletados neste formulário!</p>,
        buttons: { cancel: "Voltar", confirm: "Confirmar" },
      })
        .then((choice) => {
          if (choice === "cancel") return;
          killThisWindow();
        })
        .finally(() => {
          isHandlingBack.current = false;
        });
    },
  });

  useUpdateEffect(() => {
    if (dataCollection.isCollecting) {
      showToast({
        content: "Coletando dados do sensor...",
        duration: "short",
      });
    } else {
      showToast({
        content:
          "Parando coleta de dados do sensor. Clique no botão de salvar para guardar as informações.",
        duration: "medium",
      });
    }
  }, [dataCollection.isCollecting]);

  async function handleDiscardButton() {
    const choice = await showAlert({
      title: "Descartar dados?",
      content: (
        <p>
          Você deseja <strong>descartar os dados coletados nesta sessão</strong>?{" "}
          {dataCollection.stagingData.length} coletas do sensor serão perdidas!
        </p>
      ),
      buttons: { cancel: "Cancelar", confirm: "Descartar dados" },
    });

    if (choice === "confirm") dataCollection.discard();
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
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
            <InformationOrb
              size="small"
              label="Dados recebidos"
              count={dataCollection.stagingData.length}
              isAnimated={dataCollection.isCollecting}
            />
            <InformationOrb size="large" label="Dados salvos" count={1000} isAnimated={false} />
          </div>
          <div>
            <IconButton
              iconName={dataCollection.isCollecting ? "Pause16" : "Play16"}
              onClick={() => dataCollection.setCollecting(!dataCollection.isCollecting)}
              className="mr-4"
            />
            <IconButton
              iconName="Undo16"
              onClick={handleDiscardButton}
              disabled={
                dataCollection.isCollecting === true || dataCollection.stagingData.length === 0
              }
            />
            <IconButton
              iconName="Save16"
              disabled={
                dataCollection.isCollecting === true || dataCollection.stagingData.length === 0
              }
            />
          </div>
          <span className="text-sm">Use os controles acima para coletar dados.</span>
        </section>
      </section>
      <AppFooter />
    </main>
  );
}
