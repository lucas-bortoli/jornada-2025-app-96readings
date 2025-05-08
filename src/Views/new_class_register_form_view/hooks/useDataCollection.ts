import { useReducer, useRef, useState } from "react";
import { useMiniGBusSubscription } from "../../../Lib/gbus_mini";

type SensorDataRow = Uint16Array;

export default function useDataCollection() {
  const [, refresh] = useReducer(() => ({}), {});
  const stagingDataRef = useRef<SensorDataRow[]>([]);
  const [isCollecting, setCollecting] = useState(false);

  useMiniGBusSubscription("bluetoothSensorData", (data) => {
    if (isCollecting) {
      console.debug("sensor data:", data);
      stagingDataRef.current.push(data);
      refresh();
    }
  });

  function commit() {
    setCollecting(false);
  }

  function discard() {
    setCollecting(false);
    stagingDataRef.current.length = 0;
    refresh();
  }

  return {
    stagingData: stagingDataRef.current as ReadonlyArray<SensorDataRow>,
    isCollecting,
    setCollecting,
    commit,
    discard,
  } as const;
}
