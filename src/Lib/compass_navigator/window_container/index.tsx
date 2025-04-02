import { motion, Variant } from "framer-motion";
import type { Window } from "..";
import { CurrentWindowKeyProvider } from "./current_window_key_context";

interface WindowContainerProps<P> {
  window: Window<P>;
  zIndex: number;
}

const screenVariants = {
  enter: {
    x: "100%",
    opacity: 0.7,
  } satisfies Variant,
  active: {
    x: "0%",
    opacity: 1,
    transition: {
      type: "easeIn",
      stiffness: 300,
      damping: 30,
    },
  } satisfies Variant,
  exit: {
    x: "100%",
    opacity: 0.7,
    transition: {
      ease: "easeIn",
      duration: 0.2,
    },
  } satisfies Variant,
};

const noAnimationVariants = {
  enter: {} satisfies Variant,
  active: {} satisfies Variant,
  exit: {} satisfies Variant,
};

export default function WindowContainer<P extends object>(props: WindowContainerProps<P>) {
  const variants = props.window.noAnimation ? noAnimationVariants : screenVariants;

  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-full"
      style={{ zIndex: props.zIndex }}
      data-window-key={props.window.key}
      initial="enter"
      animate="active"
      exit="exit"
      variants={variants}>
      <CurrentWindowKeyProvider windowKey={props.window.key}>
        <props.window.component {...props.window.props} />
      </CurrentWindowKeyProvider>
    </motion.div>
  );
}
