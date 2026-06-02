// i18n-Helfer: Sprache aus URL lesen, Übersetzungen, sprachbewusste Pfade,
// und der Feld-Fallback für zweisprachige Inhaltsfelder { de, en }.

import { ui, defaultLang, isLang, type Lang, type UIKey } from './ui';

/** Liest die Sprache aus dem ersten Pfadsegment (/de/..., /en/...). Fallback: defaultLang. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return isLang(seg) ? seg : defaultLang;
}

/** Gibt eine Übersetzungsfunktion für die UI-Strings der jeweiligen Sprache zurück. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Stellt einem internen Pfad das Sprach-Präfix voran: localizePath('en', '/design') → '/en/design'. */
export function localizePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${lang}`;
  return `/${lang}${clean}`;
}

/** Tauscht das Sprach-Präfix der aktuellen URL gegen die Zielsprache (für Switcher & hreflang). */
export function getAlternatePath(url: URL, targetLang: Lang): string {
  const parts = url.pathname.split('/');
  if (isLang(parts[1])) {
    parts[1] = targetLang;
    return parts.join('/') || `/${targetLang}`;
  }
  return localizePath(targetLang, url.pathname);
}

/** Zweisprachiges Inhaltsfeld. */
export type Translatable = { de?: string; en?: string } | string | undefined | null;

/**
 * Wählt den Text in der gewünschten Sprache. Ist EN leer, wird auf DE zurückgefallen,
 * damit nie eine leere Stelle entsteht. Akzeptiert auch reine Strings (Abwärtskompatibilität).
 */
export function pick(field: Translatable, lang: Lang): string {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  if (lang === 'en' && field.en && field.en.trim() !== '') return field.en;
  return field.de ?? field.en ?? '';
}
