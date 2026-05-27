import { config, fields, collection, singleton } from '@keystatic/core';

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
          content: fields.text({ label: 'Inhalt', multiline: true }),
        }),
        image: fields.object({
          src: fields.image({ label: 'Bild', directory, publicPath }),
          alt: fields.text({ label: 'Alt Text', validation: { isRequired: false } }),
          caption: fields.text({ label: 'Bildunterschrift', validation: { isRequired: false } }),
        }),
        imageText: fields.object({
          image: fields.image({ label: 'Bild', directory, publicPath }),
          alt: fields.text({ label: 'Alt Text', validation: { isRequired: false } }),
          text: fields.text({ label: 'Text', multiline: true }),
          imagePosition: fields.select({
            label: 'Bild-Position',
            options: [
              { label: 'Links', value: 'left' },
              { label: 'Rechts', value: 'right' },
            ],
            defaultValue: 'left',
          }),
        }),
      }
    ),
    { label: 'Inhalts-Blöcke', itemLabel: () => 'Block' }
  );
}

export default config({
  storage: {
    kind: 'github',
    //kind: 'local', // Für lokales Testen
    repo: {
      owner: 'd3rdomi',
      name: 'portfolio',
   }     
  },

  singletons: {
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
          label: 'About Text',
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
  },

  collections: {
    // Design Collection
    design: collection({
      label: 'Design',
      slugField: 'title',
      path: 'src/content/design/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        thumbnail: fields.image({
          label: 'Thumbnail (Index-Seite)',
          directory: 'public/assets/design',
          publicPath: '/assets/design',
        }),
        heroImageDesktop: fields.image({
          label: 'Hero Bild Desktop',
          directory: 'public/assets/design',
          publicPath: '/assets/design',
        }),
        heroImageMobile: fields.image({
          label: 'Hero Bild Mobile',
          directory: 'public/assets/design',
          publicPath: '/assets/design',
        }),
        altText: fields.text({ label: 'Alt Text' }),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
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
            title: fields.text({ label: 'Titel', validation: { isRequired: true }}),
            text: fields.text({ label: 'Text', validation: { isRequired: true }}),
            image: fields.image({
              label: 'Bild',
              directory: 'public/assets/design',
              publicPath: '/assets/design',
              validation: { isRequired: true },
            }),
            altText: fields.text({ label: 'Alt Text' }),
          }),
        ),

        blocks: createBlocksField('public/assets/design', '/assets/design'),
        link: fields.url({ label: 'Link' }),
        copyright: fields.text({ label: 'Copyright' }),
      },
    }),

    // Concepts Collection (HIER das zweite "collections:" entfernt!)
    concepts: collection({
      label: 'Konzepte',
      slugField: 'title',
      path: 'src/content/concepts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        thumbnail: fields.image({
          label: 'Thumbnail (Index-Seite)',
          directory: 'public/assets/concepts',
          publicPath: '/assets/concepts',
        }),
        heroImageDesktop: fields.image({
          label: 'Hero Bild Desktop',
          directory: 'public/assets/concepts',
          publicPath: '/assets/concepts',
        }),
        heroImageMobile: fields.image({
          label: 'Hero Bild Mobile',
          directory: 'public/assets/concepts',
          publicPath: '/assets/concepts',
        }),
        altText: fields.text({ label: 'Alt Text' }),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
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
            title: fields.text({ label: 'Titel', validation: { isRequired: true }}),
            text: fields.text({ label: 'Text', validation: { isRequired: true }}),
            image: fields.image({
              label: 'Bild',
              directory: 'public/assets/concepts',
              publicPath: '/assets/concepts',
              validation: { isRequired: true },
            }),
            altText: fields.text({ label: 'Alt Text' }),
          }),
        ),

        blocks: createBlocksField('public/assets/concepts', '/assets/concepts'),
        link: fields.url({ label: 'Link' }),
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
        altText: fields.text({ label: 'Alt Text' }),
        heroImage: fields.image({
          label: 'Hero Image (Übersicht)',
          directory: 'public/assets/photography',
          publicPath: '/assets/photography',
        }),
        text: fields.text({ label: 'Beschreibung', multiline: true }),
        images: fields.array(
          fields.image({
            label: 'Bild',
            directory: 'public/assets/photography',
            publicPath: '/assets/photography',
          }),
          { label: 'Bilder', itemLabel: () => 'Bild' }
        ),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
      },
    }),
  },
});