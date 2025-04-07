import { useEffect } from "react";
import { useWindowing } from "./Lib/compass_navigator";
import { HomePageWindow } from "./Views/home_view";

export default function App() {
  const windowing = useWindowing();

  useEffect(() => {
    const key = windowing.createWindow(HomePageWindow, {});
    return () => windowing.removeWindow(key);
  }, []);

  return null;
}
