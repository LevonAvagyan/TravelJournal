import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Разрешает доступ извне (например, через IP в WSL)
    port: 5173, // Дефолтный порт, можно изменить, если занят
    hmr: {
      overlay: true, // Показывает оверлей ошибок в браузере
      clientPort: 5173, // Убедитесь, что порт совпадает с server.port
      protocol: "ws", // Используем WebSocket (по умолчанию)
    },
  },
  build: {
    outDir: "dist", // Убедитесь, что совпадает с firebase.json
  },
});
