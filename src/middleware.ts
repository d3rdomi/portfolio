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

// Alte Routen-Namen → neue, für dauerhafte Redirects auf bereits indexierte/verlinkte URLs.
const RENAMED_SEGMENTS: Record<string, string> = {
  design: 'online-design',
  concepts: 'print-design',
};

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

  const segments = pathname.split('/');
  const seg = segments[1];

  // Wurzel "/" → nach Browsersprache umleiten.
  if (pathname === '/' || seg === '') {
    const lang = detectLang(context.request.headers.get('accept-language'));
    return context.redirect(`/${lang}`, 302);
  }

  // Gültige Sprache → altes Routen-Segment (z.B. /de/design/...) ggf. auf das neue mappen.
  if (isLang(seg)) {
    const renamed = RENAMED_SEGMENTS[segments[2]];
    if (renamed) {
      segments[2] = renamed;
      return context.redirect(segments.join('/'), 301);
    }
    return next();
  }

  // Altes Routen-Segment ohne Sprachpräfix (z.B. /design/...) → neuer Name + Deutsch.
  const renamed = RENAMED_SEGMENTS[seg];
  if (renamed) {
    segments[1] = renamed;
    return context.redirect(`/${defaultLang}${segments.join('/')}`, 301);
  }

  // Unbekanntes erstes Segment → dauerhaft auf Deutsch.
  return context.redirect(`/${defaultLang}${pathname}`, 301);
});
