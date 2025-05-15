import { useEffect } from "react";
import { useWindowing } from "./Lib/compass_navigator";
import { useMiniGBus } from "./Lib/gbus_mini";
import { HomePageWindow } from "./Views/home_view";

export default function App() {
  const windowing = useWindowing();
  const gbus = useMiniGBus();

  useEffect(() => {
    const key = windowing.createWindow(HomePageWindow, {});
    return () => windowing.removeWindow(key);
  }, []);

  //useEffect(() => {
  //  const timer = setInterval(() => {
  //    const row = [
  //      Math.random() * 80000,
  //      Math.random() * 80000,
  //      Math.random() * 80000,
  //      Math.random() * 80000,
  //      Math.random() * 80000,
  //    ].map((i) => Math.floor(i * 100) / 100);
  //
  //    gbus.publish("bluetoothSensorData", new Uint32Array(row));
  //  }, 500);
  //
  //  return () => clearInterval(timer);
  //}, []);

  return null;
}
