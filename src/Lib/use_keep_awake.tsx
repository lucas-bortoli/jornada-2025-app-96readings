import { KeepAwake } from "@capacitor-community/keep-awake";
import { useEffect } from "react";

export default function useKeepAwake() {
  useEffect(() => {
    KeepAwake.keepAwake();

    return () => {
      KeepAwake.allowSleep();
    };
  }, []);
}
