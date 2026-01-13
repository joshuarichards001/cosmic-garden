// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://quiz.cosmic.garden',
  integrations: [react(), sitemap()],
  adapter: cloudflare({
    imageService: 'compile',
  }),
});
