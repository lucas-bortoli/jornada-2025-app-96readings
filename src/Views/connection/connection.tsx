import { motion, Variant } from "framer-motion";
import VirtualBackButton from "../../Components/VirtualBackButton";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import useKeepAwake from "../../Lib/use_keep_awake";
import ScanAnimationGraphic from "./components/scan_animation_graphic";

const variants = {
  enter: {
    scale: 0,
    opacity: 0.7,
  } satisfies Variant,
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.15,
    },
  } satisfies Variant,
  exit: {
    scale: 0,
    transition: {
      ease: "easeIn",
      duration: 0.2,
    },
  } satisfies Variant,
};

interface ConnectionProps {}

export default function Connection(props: ConnectionProps) {
  useProvideCurrentWindow({
    backButtonHandler: (exit) => exit(),
  });

  useKeepAwake();

  return (
    <div className="h-full w-full bg-white/20 backdrop-blur-sm">
      <motion.div
        className="shadow-pixel-sm border-grey-800 fixed top-1/2 left-1/2 flex h-2/3 w-[calc(100%-theme('spacing.8'))] -translate-x-1/2 -translate-y-1/2 flex-col border bg-white p-4 font-serif"
        initial="enter"
        animate="active"
        exit="exit"
        variants={variants}>
        <header className="flex items-center gap-4">
          <VirtualBackButton />
          <h1 className="text-2xl">Conectar ao Hardware</h1>
        </header>
        <main className="flex shrink grow flex-col items-center justify-center gap-8 overflow-y-scroll">
          <ScanAnimationGraphic className="inline-block w-1/3" />
          <h2>Procurando dispositivo...</h2>
        </main>
      </motion.div>
    </div>
  );
}
