import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['weevil-together-mullet.ngrok-free.app'] // 👈 Thêm domain ngrok vào đây
  }
});
