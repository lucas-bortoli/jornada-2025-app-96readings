import { AnimatePresence, motion, Variant } from "framer-motion";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import sequence, { Sequence } from "../../Lib/sequence_generator";
import doSwitch from "../../Lib/switch_expression";

export type ToastKey = Sequence<"Toast">;
const makeToastKey = sequence<ToastKey>();

export interface Toast {
  key: ToastKey;
  content: PropsWithChildren["children"];
  timeoutTimer: ReturnType<typeof setTimeout> | null;
}

const context = createContext<null | [Toast[], Dispatch<SetStateAction<Toast[]>>]>(null);

export function ToastProvider(props: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  return <context.Provider value={[toasts, setToasts]}>{props.children}</context.Provider>;
}

const variants = {
  enter: {
    y: 256,
  } satisfies Variant,
  active: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.1,
    },
  } satisfies Variant,
  exit: {
    y: 256,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.1,
    },
  } satisfies Variant,
};

export function ToastsOutlet() {
  const [toasts] = useContext(context)!;

  return (
    <div
      data-toasts-outlet=""
      inert
      className="pointer-events-none fixed top-0 left-0 h-full w-full overflow-hidden">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.article
              key={toast.key}
              initial="enter"
              animate="active"
              exit="exit"
              variants={variants}
              className="text-grey-100 bg-grey-800 fixed bottom-4 left-1/2 w-[calc(100%-theme('spacing.8'))] -translate-x-1/2 p-4">
              {toast.content}
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

interface ToastOptions {
  content: PropsWithChildren["children"];
  duration?: "shortest" | "short" | "medium" | "long";
}

export function useToast() {
  const [_, setToasts] = useContext(context)!;

  const createToast = useCallback((options: ToastOptions) => {
    const duration = options.duration ?? "short";
    const durationTime = doSwitch(duration, {
      shortest: 1000,
      short: 2000,
      medium: 4000,
      long: 8000,
    });

    const toast: Toast = {
      key: makeToastKey(),
      content: options.content,
      timeoutTimer: null,
    };

    toast.timeoutTimer = setTimeout(() => {
      toast.timeoutTimer = null;
      setToasts((toasts) => toasts.filter((t) => t.key !== toast.key));
    }, durationTime);

    setToasts((toasts) => [...toasts, toast]);
  }, []);

  return createToast;
}
