import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Backend Spring
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // niente rewrite se il backend espone già /api/...
      },
    },
  },
});
