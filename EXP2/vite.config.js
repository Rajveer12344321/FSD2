import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the Redux Content State Management project.
// Uses the official React plugin (Babel-based fast refresh).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  }
});
