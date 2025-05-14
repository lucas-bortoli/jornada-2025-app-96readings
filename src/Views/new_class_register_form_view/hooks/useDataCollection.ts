import { useReducer, useRef, useState } from "react";
import { useMiniGBusSubscription } from "../../../Lib/gbus_mini";

export default function useDataCollection() {
  const [, refresh] = useReducer(() => ({}), {});
  const stagingDataRef = useRef<Uint32Array[]>([]);
  const [isCollecting, setCollecting] = useState(false);

  useMiniGBusSubscription("bluetoothSensorData", (data) => {
    if (isCollecting) {
      console.debug("sensor data:", data);
      stagingDataRef.current.push(data);
      refresh();
    }
  });

  function discard() {
    setCollecting(false);
    stagingDataRef.current = [];
    refresh();
  }

  return {
    stagingData: stagingDataRef.current as ReadonlyArray<Uint32Array>,
    isCollecting,
    setCollecting,
    discard,
  } as const;
}
