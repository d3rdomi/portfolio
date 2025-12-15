import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

import markdoc from '@astrojs/markdoc';

export default defineConfig({
  site: 'https://portfolio-dominik.netlify.app',
  output: 'server', // Geändert!
  adapter: netlify(),
  integrations: [
    mdx(),
    sitemap(),
    react(),
    keystatic(),
    markdoc(),
  ],
});