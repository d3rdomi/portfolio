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
    // Design Collection (basierend auf deiner config.ts)
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
        images: fields.array(
          fields.image({
            label: 'Bild',
            directory: 'public/assets/design',
            publicPath: '/assets/design',
          }),
          { label: 'Bilder', itemLabel: props => props.value || 'Bild' }
        ),

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

    // Motion Design Collection
    motionDesign: collection({
      label: 'Motion Design',
      slugField: 'title',
      path: 'src/content/motion-design/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        text: fields.text({ label: 'Text' }),
        images: fields.array(
          fields.image({
            label: 'Bild',
            directory: 'src/assets/motion-design',
            publicPath: '~/assets/motion-design',
          }),
          { label: 'Bilder', itemLabel: props => props.value || 'Bild' }
        ),
        description: fields.text({ label: 'Beschreibung' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'src/assets/motion-design',
          publicPath: '~/assets/motion-design',
        }),
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
        images: fields.array(
          fields.image({
            label: 'Foto',
            directory: 'src/assets/photography',
            publicPath: '~/assets/photography',
          }),
          { label: 'Fotos', itemLabel: props => props.value || 'Foto' }
        ),
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