import { motion } from "framer-motion";
import useAlert from "../../Components/AlertDialog";
import AppFooter from "../../Components/AppFooter";
import { useWindowing } from "../../Lib/compass_navigator";
import NewClassRegisterView from "../new_class_register_form_view";

export default function TrainingPage() {
  const showAlert = useAlert();
  const windowing = useWindowing();

  function openCreateNewClassPage() {
    windowing.createWindow({
      title: "Criar nova classe",
      component: NewClassRegisterView,
      props: {},
      backButton: false, // lidado na própria janela
    });
  }

  function trilhaNotAvailable() {
    showAlert({
      title: "Trilha indisponível",
      content: (
        <p>Desculpe, essa trilha está indisponível na versão de demonstração do aplicativo.</p>
      ),
      buttons: { ok: "OK" },
    });
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <section>
        <span className="mx-4">Minhas classes</span>
        <ul className="flex h-60 w-full gap-2 overflow-x-scroll py-2 before:mr-2 after:ml-2">
          <motion.li
            key="new_class"
            whileTap={{ scale: 1.05 }}
            className="shadow-pixel-sm border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border bg-white p-2"
            onClick={openCreateNewClassPage}>
            <h3 className="text-lg font-semibold">Nova classe</h3>
            <span className="text-sm">Coletar amostras para uma nova classe</span>
          </motion.li>
          {[0, 1].map((card) => (
            <motion.li
              key={card}
              whileTap={{ scale: 1.05 }}
              className="shadow-pixel-sm border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border bg-white p-2"
              onClick={trilhaNotAvailable}>
              <h3 className="text-lg font-semibold">Classe</h3>
              <span className="text-sm">3 amostras</span>
            </motion.li>
          ))}
        </ul>
      </section>
      <AppFooter />
    </main>
  );
}
