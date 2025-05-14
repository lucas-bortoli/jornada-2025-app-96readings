import { useEffect, useRef } from "react";
import { BackButtonHandler, useWindowing, Window } from "..";
import useCurrentRef from "../../use_current_ref";
import useCurrentWindowKey from "./current_window_key_context";

export interface UseCurrentWindowOptions {
  title?: string | null;
  backButtonHandler?: BackButtonHandler;
}

export default function useProvideCurrentWindow<P = any>(
  options: UseCurrentWindowOptions
): Window<P> {
  const windowing = useWindowing();
  const currentWindowKey = useCurrentWindowKey();
  const backHandlerRef = useCurrentRef(options.backButtonHandler ?? null);

  useEffect(() => {
    windowing.updateWindow(currentWindowKey, {
      title: options.title,
      backButtonHandler: backHandlerRef,
    });
  }, [options.title]);

  // will never be null on the first render, only when leaving
  const currentWindow = windowing.windows.find((w) => w.key === currentWindowKey) ?? null;

  // when unmounting and during an animation, the returned `currentWindow` becomes null. This memorizes the most recent window reference.
  const currentWindowNeverNullRef = useRef<Window<P> | null>(null);
  if (currentWindow !== null) {
    currentWindowNeverNullRef.current = currentWindow;
  }

  return currentWindowNeverNullRef.current!;
}
