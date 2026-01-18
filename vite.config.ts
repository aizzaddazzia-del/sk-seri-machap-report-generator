import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sk-seri-machap-report-generator/', // penting untuk GitHub Pages
  plugins: [react()],
});
