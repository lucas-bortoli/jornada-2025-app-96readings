import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import useObjectSubscription from "../imperative_object";
import BluetoothOps from "./connection";

const context = createContext<null | BluetoothOps>(null);

export function BluetoothProvider(props: PropsWithChildren) {
  const bluetooth = useMemo(() => new BluetoothOps(), []);

  //@ts-expect-error
  window.bluetooth = bluetooth;

  return <context.Provider value={bluetooth}>{props.children}</context.Provider>;
}

export default function useBluetoothConnection() {
  const bluetooth = useObjectSubscription(useContext(context)!);

  return bluetooth;
}
