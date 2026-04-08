import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const workspaceRoot = process.cwd();
const srcRoot = path.resolve(workspaceRoot, 'src');

export default defineConfig({
  base: '/pregnancy-assistant/',
  root: srcRoot,
  plugins: [react()],
  server: {
    allowedHosts: true
  },
  build: {
    outDir: path.resolve(workspaceRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(srcRoot, 'index.html'),
      }
    }
  }
});
