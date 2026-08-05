import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Reset to default root path for local dev
  server: {
    port: 5173,
    open: false,
  },
});