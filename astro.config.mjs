import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.fahey.vip',
  output: 'static',
  cacheDir: './.astro-cache',
  vite: {
    plugins: [tailwindcss()],
  },
});
