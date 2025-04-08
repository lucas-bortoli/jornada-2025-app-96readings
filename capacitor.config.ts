import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bortoli.nsreadings",
  appName: "96Readings",
  webDir: "dist",
  server: {
    url: "http://localhost:5173",
    cleartext: true,
  },
  android: {
    // mixed content e cleartext: permitem o aplicativo compilado contatar o servidor HTTP de telemetria
    allowMixedContent: true,
  },
};

export default config;
