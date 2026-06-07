// Zentrale Sprach-Definitionen und UI-Texte für DE / EN.
// Inhaltstexte (Projekte, Fotografie, About) kommen aus Keystatic – hier stehen nur
// die festen Oberflächen-Strings.

export const languages = ['de', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'de';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export const ui = {
  de: {
    'site.title': 'Dominik Lange | Designer aus München',
    'site.description':
      'Dominik Lange, Designer aus München. Mediengestalter mit Fokus auf Design, UX & UI, Motion & Web. Portfolio & Projekte entdecken.',
    'site.locale': 'de-DE',

    'nav.home': 'Home',
    'nav.about': 'Über Mich',
    'nav.photography': 'Fotografie',
    'nav.design': 'Design',
    'nav.concepts': 'Konzepte',

    'home.about': 'Über mich',
    'home.photography': 'Fotografie',
    'home.design': 'Design',
    'home.concepts': 'Konzepte',

    'heading.about': 'Über mich',
    'heading.photography': 'Fotografie',
    'heading.design': 'Design',
    'heading.concepts': 'Konzepte',

    'about.portraitAlt': 'Ein Foto von mir, Dominik Lange',
    'about.form.firstName': 'Vorname',
    'about.form.lastName': 'Nachname',
    'about.form.email': 'E-Mail',
    'about.form.message': 'Nachricht',
    'about.form.submit': 'Senden',

    'footer.text': 'Impressum & Datenschutz',

    'switch.label': 'Sprache wechseln',

    'design.downloadPdf': 'Portfolio herunterladen',
  },
  en: {
    'site.title': 'Dominik Lange | Designer from Munich',
    'site.description':
      'Dominik Lange, designer from Munich. Media designer focused on design, UX & UI, motion & web. Discover the portfolio & projects.',
    'site.locale': 'en-US',

    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.photography': 'Photography',
    'nav.design': 'Design',
    'nav.concepts': 'Concepts',

    'home.about': 'About me',
    'home.photography': 'Photography',
    'home.design': 'Design',
    'home.concepts': 'Concepts',

    'heading.about': 'About me',
    'heading.photography': 'Photography',
    'heading.design': 'Design',
    'heading.concepts': 'Concepts',

    'about.portraitAlt': 'A photo of me, Dominik Lange',
    'about.form.firstName': 'First name',
    'about.form.lastName': 'Last name',
    'about.form.email': 'Email',
    'about.form.message': 'Message',
    'about.form.submit': 'Send',

    'footer.text': 'Imprint & Privacy',

    'switch.label': 'Switch language',

    'design.downloadPdf': 'Download Portfolio',
  },
} as const;

export type UIKey = keyof (typeof ui)['de'];
