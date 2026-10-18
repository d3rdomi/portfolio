import { config, fields, collection, singleton } from '@keystatic/core';

// Zweisprachiges Textfeld: zeigt in Keystatic "Deutsch" und "English" als Gruppe.
// English ist optional – ist es leer, fällt die Website automatisch auf Deutsch zurück.
function tText(
  label: string,
  opts: { multiline?: boolean; description?: string } = {}
) {
  const { multiline = false, description } = opts;
  return fields.object(
    {
      de: fields.text({ label: 'Deutsch', multiline, validation: { isRequired: false } }),
      en: fields.text({ label: 'English', multiline, validation: { isRequired: false } }),
    },
    { label, description }
  );
}

function createBlocksField(directory: string, publicPath: string) {
  return fields.array(
    fields.conditional(
      fields.select({
        label: 'Block-Typ',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Bild', value: 'image' },
          { label: 'Bild + Text', value: 'imageText' },
        ],
        defaultValue: 'text',
      }),
      {
        text: fields.object({
          headline: tText('Überschrift'),
          content: tText('Inhalt', { multiline: true }),
        }),
        image: fields.object({
          headline: tText('Überschrift'),
          src: fields.image({ label: 'Bild', directory, publicPath }),
          alt: tText('Alt Text'),
        }),
        imageText: fields.object({
          headline: tText('Überschrift'),
          image: fields.image({ label: 'Bild', directory, publicPath }),
          alt: tText('Alt Text'),
          text: tText('Text', { multiline: true }),
          imagePosition: fields.select({
            label: 'Bild-Position',
            options: [
              { label: 'Links', value: 'left' },
              { label: 'Rechts', value: 'right' },
              { label: 'Oben', value: 'top' },
              { label: 'Unten', value: 'bottom' },
            ],
            defaultValue: 'left',
          }),
        }),
      }
    ),
    {
      label: 'Inhalts-Blöcke',
      itemLabel: (props) => {
        const item = props as any;
        const disc: string = item.discriminant ?? '';
        const typeLabel: Record<string, string> = {
          text: 'Text',
          image: 'Bild',
          imageText: 'Bild + Text',
        };
        const base = typeLabel[disc] ?? 'Block';
        const headlineDe = item.value?.headline?.de as string | undefined;
        return headlineDe?.trim() ? `${base} – ${headlineDe}` : base;
      },
    }
  );
}

export default config({
  storage: {
    kind: 'github',
    //kind: 'local', // Für lokales Testen
    repo: {
      owner: 'd3rdomi',
      name: 'portfolio',
    },
    branchPrefix: 'keystatic/',
  },

  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/home/',
      format: { contentField: 'heading' },
      schema: {
        portrait: fields.image({
          label: 'Portrait Bild',
          directory: 'public/assets/home',
          publicPath: '/assets/home/',
        }),
        heading: fields.document({
          label: 'Tagline (Deutsch)',
          formatting: false,
          links: false,
          dividers: false,
        }),
        headingEn: fields.text({
          label: 'Tagline (English)',
          description: 'Englische Version. Bleibt leer → Deutsch wird gezeigt.',
          validation: { isRequired: false },
        }),
      },
    }),

    portfolioDownloads: singleton({
      label: 'Portfolio Downloads',
      path: 'src/content/portfolio-downloads/',
      format: { data: 'yaml' },
      schema: {
        pdfDe: fields.file({
          label: 'Portfolio PDF (Deutsch)',
          directory: 'public/assets/downloads',
          publicPath: '/assets/downloads/',
        }),
        pdfEn: fields.file({
          label: 'Portfolio PDF (English)',
          directory: 'public/assets/downloads',
          publicPath: '/assets/downloads/',
        }),
      },
    }),

    about: singleton({
      label: 'About Me',
      path: 'src/content/about-me/',
      format: { contentField: 'text' },
      schema: {
        portrait: fields.image({
          label: 'Portrait Bild',
          directory: 'public/assets/about',
          publicPath: '/assets/about/',
        }),
        text: fields.document({
          label: 'About Text (Deutsch)',
          formatting: true,
          links: true,
          dividers: true,
        }),
        textEn: fields.text({
          label: 'About Text (English)',
          multiline: true,
          description: 'Englische Version. Leerzeile = neuer Absatz. Bleibt leer → Deutsch wird gezeigt.',
          validation: { isRequired: false },
        }),
        cvDe: fields.file({
          label: 'Lebenslauf PDF (Deutsch)',
          directory: 'public/assets/downloads',
          publicPath: '/assets/downloads/',
        }),
        cvEn: fields.file({
          label: 'Lebenslauf PDF (English)',
          directory: 'public/assets/downloads',
          publicPath: '/assets/downloads/',
        }),
      },
    }),
  },

  collections: {
    // Online-Design Collection
    'online-design': collection({
      label: 'Online-Design',
      slugField: 'title',
      path: 'src/content/online-design/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        thumbnail: fields.image({
          label: 'Thumbnail (Index-Seite)',
          directory: 'public/assets/online-design',
          publicPath: '/assets/online-design',
        }),
        heroImageDesktop: fields.image({
          label: 'Hero Bild Desktop',
          directory: 'public/assets/online-design',
          publicPath: '/assets/online-design',
        }),
        heroImageMobile: fields.image({
          label: 'Hero Bild Mobile',
          directory: 'public/assets/online-design',
          publicPath: '/assets/online-design',
        }),
        altText: tText('Alt Text'),
        content: fields.document({
          label: 'Inhalt (Deutsch)',
          formatting: true,
          links: true,
        }),
        contentEn: fields.text({
          label: 'Inhalt (English)',
          multiline: true,
          validation: { isRequired: false },
        }),
        button: fields.object(
          {
            buttonLink: fields.text({
              label: 'Button Link (leer = kein Button)',
              validation: { isRequired: false },
            }),
            buttonLabel: tText('Button Beschriftung', {
              description: 'Leer lassen für Standard-Text ("mehr erfahren" / "learn more")',
            }),
          },
          { label: 'Button' }
        ),
        backgroundColor: fields.text({
          label: 'Hintergrundfarbe',
          defaultValue: '#000000',
          description: 'Hex-Code für die Hintergrundfarbe mit # (z.B. #ff5733)',
          validation: {
            length: {
              min: 4,
              max: 7
            }
          }
        }),

        // ImageCarousel
        ImageCarousel: fields.array(
          fields.object({
            image: fields.image({
              label: 'Bild',
              directory: 'public/assets/online-design',
              publicPath: '/assets/online-design',
              validation: { isRequired: true },
            }),
            altText: tText('Alt Text'),
          }),
          { label: 'Carousel', itemLabel: () => 'Bild' }
        ),

        blocks: createBlocksField('public/assets/online-design', '/assets/online-design'),
        copyright: fields.text({ label: 'Copyright' }),
      },
    }),

    // Print-Design Collection
    'print-design': collection({
      label: 'Print-Design',
      slugField: 'title',
      path: 'src/content/print-design/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        thumbnail: fields.image({
          label: 'Thumbnail (Index-Seite)',
          directory: 'public/assets/print-design',
          publicPath: '/assets/print-design',
        }),
        heroImageDesktop: fields.image({
          label: 'Hero Bild Desktop',
          directory: 'public/assets/print-design',
          publicPath: '/assets/print-design',
        }),
        heroImageMobile: fields.image({
          label: 'Hero Bild Mobile',
          directory: 'public/assets/print-design',
          publicPath: '/assets/print-design',
        }),
        altText: tText('Alt Text'),
        content: fields.document({
          label: 'Inhalt (Deutsch)',
          formatting: true,
          links: true,
        }),
        contentEn: fields.text({
          label: 'Inhalt (English)',
          multiline: true,
          validation: { isRequired: false },
        }),
        button: fields.object(
          {
            buttonLink: fields.text({
              label: 'Button Link (leer = kein Button)',
              validation: { isRequired: false },
            }),
            buttonLabel: tText('Button Beschriftung', {
              description: 'Leer lassen für Standard-Text ("mehr erfahren" / "learn more")',
            }),
          },
          { label: 'Button' }
        ),
        backgroundColor: fields.text({
          label: 'Hintergrundfarbe',
          defaultValue: '#000000',
          description: 'Hex-Code für die Hintergrundfarbe mit # (z.B. #ff5733)',
          validation: {
            length: {
              min: 4,
              max: 7
            }
          }
        }),

        // ImageCarousel
        ImageCarousel: fields.array(
          fields.object({
            image: fields.image({
              label: 'Bild',
              directory: 'public/assets/print-design',
              publicPath: '/assets/print-design',
              validation: { isRequired: true },
            }),
            altText: tText('Alt Text'),
          }),
          { label: 'Carousel', itemLabel: () => 'Bild' }
        ),

        blocks: createBlocksField('public/assets/print-design', '/assets/print-design'),
        copyright: fields.text({ label: 'Copyright' }),
      },
    }),

    // Photography Collection
    photography: collection({
      label: 'Photography',
      slugField: 'title',
      path: 'src/content/photography/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        altText: tText('Alt Text'),
        heroImage: fields.image({
          label: 'Hero Image (Übersicht)',
          directory: 'public/assets/photography',
          publicPath: '/assets/photography',
        }),
        text: tText('Beschreibung', { multiline: true }),
        images: fields.array(
          fields.image({
            label: 'Bild',
            directory: 'public/assets/photography',
            publicPath: '/assets/photography',
          }),
          { label: 'Bilder', itemLabel: () => 'Bild' }
        ),
        content: fields.document({
          label: 'Inhalt (Deutsch)',
          formatting: true,
          links: true,
        }),
        contentEn: fields.text({
          label: 'Inhalt (English)',
          multiline: true,
          validation: { isRequired: false },
        }),
      },
    }),
  },
});
