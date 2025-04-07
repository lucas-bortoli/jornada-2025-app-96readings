import { useEffect } from "react";
import { BackButtonHandler, useWindowing } from "..";
import useCurrentRef from "../../use_current_ref";
import useCurrentWindowKey from "./current_window_key_context";

export interface UseCurrentWindowOptions {
  title?: string | null;
  backButtonHandler?: BackButtonHandler;
}

export default function useProvideCurrentWindow(options: UseCurrentWindowOptions) {
  const windowing = useWindowing();
  const currentWindowKey = useCurrentWindowKey();
  const backHandlerRef = useCurrentRef(options.backButtonHandler ?? null);

  useEffect(() => {
    windowing.updateWindow(currentWindowKey, {
      title: options.title,
      backButtonHandler: backHandlerRef,
    });
  }, [options.title]);

  const currentWindow = windowing.windows.find((w) => w.key === currentWindowKey);

  return currentWindow;
}
