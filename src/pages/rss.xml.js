import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  // Alle Collections abrufen
  const designPosts = await getCollection('design');
  const photographyPosts = await getCollection('photography');

  // Alle Posts zusammenführen
  const allPosts = [
    ...designPosts.map((post) => ({
      ...post.data,
      link: `/design/${post.slug}/`,
    })),
    ...photographyPosts.map((post) => ({
      ...post.data,
      link: `/photography/${post.slug}/`,
    })),
  ];

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: allPosts,
  });
}