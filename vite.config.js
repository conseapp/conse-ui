import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react-swc'

const manifestForPlugin = {
  name: "Dopamine",
  short_name: "Dopamine",
  description: "تورنمنت بزرگ شب مافیا",
  display: "standalone",
  background_color: "#242728",
  theme_color: "#8936FF",
  icons: [
    {
      src: "icon512_maskable.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "icon512_rounded.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), VitePWA(manifestForPlugin)],
});
