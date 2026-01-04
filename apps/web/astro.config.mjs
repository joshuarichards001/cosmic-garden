// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare({
    imageService: 'compile',
  }),
});
