import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react'; // Wird automatisch hinzugefügt
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://https://portfolio-dominik.netlify.app/',
  integrations: [
    mdx(), 
    sitemap(),
    react(), // React MUSS vor Keystatic stehen!
    keystatic(),
  ],
});