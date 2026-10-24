import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/node_modules/three/")) return "three-core";
          if (id.includes("/node_modules/three-stdlib/")) return "three-stdlib";
          if (id.includes("/node_modules/@react-three/")) return "react-three";
          if (id.includes("/node_modules/postprocessing/")) return "postprocessing";
          if (id.includes("/node_modules/gsap/")) return "gsap";
          if (id.includes("/node_modules/lenis/")) return "lenis";
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react-vendor";
          return undefined;
        },
      },
    },
  },
});
