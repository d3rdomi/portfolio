import { config, fields, collection, singleton } from '@keystatic/core';

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
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/assets/design',
          publicPath: '/assets/design',
        }),
        altText: fields.text({ label: 'Alt Text' }),
        text: fields.text({ label: 'Text' }),
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

        link: fields.url({ label: 'Link' }),
        copyright: fields.text({ label: 'Copyright' }),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
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
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/assets/concepts',
          publicPath: '/assets/concepts',
        }),
        altText: fields.text({ label: 'Alt Text' }),
        text: fields.text({ label: 'Text' }),
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

        link: fields.url({ label: 'Link' }),
        copyright: fields.text({ label: 'Copyright' }),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
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
          label: 'Hero Image',
          directory: 'src/assets/photography',
          publicPath: '~/assets/photography',
        }),
        text: fields.text({ label: 'Text' }),
        content: fields.document({
          label: 'Inhalt',
          formatting: true,
          links: true,
        }),
      },
    }),
  },
});