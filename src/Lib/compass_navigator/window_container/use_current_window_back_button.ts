import { useRef } from "react";
import { useWindowing, WindowKey } from "..";
import { useBackButtonHandler } from "../../back_button";
import useCurrentWindowKey from "./current_window_key_context";

type Callback = (currentWindowKey: WindowKey) => void;

export default function useCurrentWindowBackButton(callback: Callback) {
  const windowing = useWindowing();
  const currentWindowKey = useCurrentWindowKey();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useBackButtonHandler(() => {
    if (windowing.windows.at(-1)?.key === currentWindowKey) {
      callbackRef.current(currentWindowKey);
    }
  });
}
