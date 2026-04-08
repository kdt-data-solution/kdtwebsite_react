import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

export default defineConfig({
  base: '/kdtwebsite_react/',
  plugins: [tailwindcss()],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});