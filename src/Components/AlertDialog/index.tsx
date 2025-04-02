import { motion, Variant } from "framer-motion";
import { useCallback, useEffect, useRef, type PropsWithChildren } from "react";
import { useWindowing } from "../../Lib/compass_navigator";
import Deferred from "../../Lib/deferred";
import { Sequence } from "../../Lib/sequence_generator";
import Button from "../Button";

interface AlertDialogProps<ActionKeys extends string> extends PropsWithChildren {
  title: string;
  buttons: Record<ActionKeys, string>;
  onButton: (action: ActionKeys) => void;
}

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

function AlertDialog<ActionKeys extends string>(props: AlertDialogProps<ActionKeys>) {
  return (
    <div className="h-full w-full bg-white/20 backdrop-blur-sm">
      <motion.div
        initial="enter"
        animate="active"
        exit="exit"
        variants={variants}
        className="border-gray shadow-pixel-sm absolute top-1/2 left-1/2 flex w-[calc(100%-theme('spacing.8'))] -translate-x-1/2 -translate-y-1/2 flex-col items-stretch gap-2 border bg-white p-4">
        <h1 className="border-b border-gray-200 pb-2 text-center text-xl">{props.title}</h1>
        <main className="max-h-[50lvh] shrink grow overflow-y-scroll">{props.children}</main>
        <footer className="flex justify-end gap-2">
          {Object.entries(props.buttons).map(([action, label]) => (
            <Button
              key={action}
              className="basis-0"
              onClick={() => props.onButton(action as ActionKeys)}
              title="Dialog Action">
              {label as string}
            </Button>
          ))}
        </footer>
      </motion.div>
    </div>
  );
}

interface AlertConfig<ActionKeys extends string> {
  title: string;
  content: PropsWithChildren["children"];
  buttons: Record<ActionKeys, string>;
}

export default function useAlert() {
  const windowing = useWindowing();
  const alertWindowsRef = useRef<[Sequence, Deferred<any>][]>([]);

  const showAlert = useCallback(function showAlert<ActionKeys extends string>(
    config: AlertConfig<ActionKeys>
  ): Promise<ActionKeys> {
    const deferred = new Deferred<ActionKeys>();

    const createdWindow = windowing.createWindow<AlertDialogProps<ActionKeys>>({
      component: AlertDialog,
      title: "Alert Dialog",
      props: {
        title: config.title,
        buttons: config.buttons,
        children: config.content,
        onButton: (action) => {
          windowing.removeSpecificWindow(createdWindow);
          alertWindowsRef.current = alertWindowsRef.current.filter((w) => w[0] !== createdWindow);
          deferred.resolve(action);
        },
      },
      noAnimation: true,
      backButton: false,
    });

    alertWindowsRef.current.push([createdWindow, deferred]);

    return deferred.promise;
  }, []);

  useEffect(() => {
    return () => {
      alertWindowsRef.current.forEach((alert) => {
        windowing.removeSpecificWindow(alert[0]);
        alert[1].reject("Unmounting...");
      });
    };
  }, []);

  return showAlert;
}
