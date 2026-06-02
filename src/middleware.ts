import { defineMiddleware } from 'astro:middleware';
import { isLang, defaultLang } from './i18n/ui';

// Pfade, die NICHT umgeleitet werden (Keystatic, API, Astro-intern, Impressum, statische Dateien).
const PASS = [
  /^\/keystatic/,
  /^\/api(\/|$)/,
  /^\/admin(\/|$)/,
  /^\/impressum(\/|$)/,
  /^\/rss(\.|\/|$)/,
  /^\/_/, // /_astro, /_image, /_server-islands ...
];

function detectLang(header: string | null): string {
  if (!header) return defaultLang;
  const entries = header
    .toLowerCase()
    .split(',')
    .map((part) => part.split(';')[0].trim());
  for (const e of entries) {
    if (e.startsWith('en')) return 'en';
    if (e.startsWith('de')) return 'de';
  }
  return defaultLang;
}

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Dateien (haben eine Endung) und Sonderpfade unangetastet lassen.
  if (PASS.some((re) => re.test(pathname)) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return next();
  }

  const seg = pathname.split('/')[1];

  // Wurzel "/" → nach Browsersprache umleiten.
  if (pathname === '/' || seg === '') {
    const lang = detectLang(context.request.headers.get('accept-language'));
    return context.redirect(`/${lang}`, 302);
  }

  // Gültige Sprache → normal weiter.
  if (isLang(seg)) {
    return next();
  }

  // Unbekanntes erstes Segment (z.B. alte URLs wie /design) → dauerhaft auf Deutsch.
  return context.redirect(`/${defaultLang}${pathname}`, 301);
});
