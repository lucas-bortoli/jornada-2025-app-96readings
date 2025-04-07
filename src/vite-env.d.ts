/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import "react";

// permitir uso de variáveis CSS no atributo style
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
