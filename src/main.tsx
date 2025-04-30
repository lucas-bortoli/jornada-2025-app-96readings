import { createRoot } from "react-dom/client";
import App from "./App";
import { ToastProvider, ToastsOutlet } from "./Components/Toast";
import "./index.css";
import { BackButtonProvider } from "./Lib/back_button";
import { WindowManagerProvider, WindowsOutlet } from "./Lib/compass_navigator";
import { MiniGBusProvider } from "./Lib/gbus_mini";

import "./Estimator/index";
import { BluetoothProvider } from "./Lib/bluetooth";

createRoot(document.getElementById("root")!).render(
  <MiniGBusProvider>
    <BluetoothProvider>
      <BackButtonProvider>
        <ToastProvider>
          <WindowManagerProvider>
            <App />
            <WindowsOutlet />
            <ToastsOutlet />
          </WindowManagerProvider>
        </ToastProvider>
      </BackButtonProvider>
    </BluetoothProvider>
  </MiniGBusProvider>
);
