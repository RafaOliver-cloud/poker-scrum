import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function getPackageName(modulePath: string): string {
  const packagePath = modulePath.split("node_modules/")[1];
  if (!packagePath) return "vendor";

  // Handle scoped packages (e.g. @radix-ui/react-dialog)
  if (packagePath.startsWith("@")) {
    return packagePath.split("/").slice(0, 2).join("/");
  }

  return packagePath.split("/")[0];
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          return `vendor-${getPackageName(id).replace("/", "-")}`;
        },
      },
    },
  },
}));
