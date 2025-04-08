import { motion } from "framer-motion";
import AppFooter from "../../Components/AppFooter";
import { useToast } from "../../Components/Toast";
import { cn } from "../../Lib/class_names";
import { manifest, useWindowing } from "../../Lib/compass_navigator";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import { useStateSet } from "../../Lib/use_map_set";
import { NewClassRegisterWindow } from "../new_class_register_form_view";

export default function TrainingPage() {
  const showToast = useToast();
  const windowing = useWindowing();
  const [selectedClasses, mutateSelectedClasses] = useStateSet<number>(() => new Set([1]));

  useProvideCurrentWindow({
    title: ["Treinamento", `${selectedClasses} classes selecionadas`].join(" - "),
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

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <section>
        <span className="mx-4">Minzhas clasxxzzsses</span>
        <ul className="flex h-60 w-full gap-2 overflow-x-scroll py-2 before:mr-2 after:ml-2">
          <motion.li
            key="new_class"
            whileTap={{ scale: 1.05 }}
            className="shadow-pixel-sm border-grey-800 flex aspect-[3/4] h-full shrink-0 flex-col justify-end overflow-hidden border bg-white p-2"
            onClick={openCreateNewClassPage}>
            <h3 className="text-lg font-semibold">Nova classe</h3>
            <span className="text-sm">Coletar amostras para uma nova classe</span>
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

export const TrainingPageWindow = manifest(TrainingPage, {
  initialTitle: () => "Treinamento",
  hasAnimation: true,
});
