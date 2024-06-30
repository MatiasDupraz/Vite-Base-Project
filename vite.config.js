import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { json } from "react-router-dom";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true,
  },
});
