import { viteReactConfig } from "@repo/eslint-config/vite-react";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  ...viteReactConfig,
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
