import { App, BackButtonListenerEvent } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useMiniGBus } from "./gbus_mini";

export function BackButtonProvider(props: PropsWithChildren) {
  const gbus = useMiniGBus();

  useEffect(() => {
    function handleBackButton(_event: BackButtonListenerEvent | null) {
      gbus.publish("backButton", null);
    }

    let subscription: PluginListenerHandle | null = null;

    App.addListener("backButton", handleBackButton).then((handle) => {
      // cleanup previous subscription, if any
      subscription?.remove();
      subscription = handle;
    });

    // simulate back button with "Esc" key
    const cancelEscKey = new AbortController();
    document.addEventListener(
      "keyup",
      (event) => {
        if (event.key === "Escape") {
          handleBackButton(null);
        }
      },
      {
        signal: cancelEscKey.signal,
      }
    );

    return () => {
      subscription?.remove();
      cancelEscKey.abort();
    };
  }, [gbus]);

  return props.children;
}

export function useBackButtonHandler(callback: () => void) {
  const gbus = useMiniGBus();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handle = gbus.subscribe("backButton", () => {
      callbackRef.current();
    });

    return () => gbus.unsubscribe(handle);
  }, [gbus]);
}

export function useBackButtonTrigger() {
  const gbus = useMiniGBus();

  return useCallback(
    function trigger() {
      gbus.publish("backButton", null);
    },
    [gbus]
  );
}
