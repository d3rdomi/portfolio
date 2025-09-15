import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify'; // Neu hinzugefügt

export default defineConfig({
  site: 'https://portfolio-dominik.netlify.app',
  output: 'server', // Neu hinzugefügt
  adapter: netlify(), // Neu hinzugefügt
  integrations: [
    mdx(), 
    sitemap(),
    react(),
    keystatic(),
  ],
});