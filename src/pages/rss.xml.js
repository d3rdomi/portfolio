import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  // Alle Collections abrufen
  const onlineDesignPosts = await getCollection('online-design');
  const printDesignPosts = await getCollection('print-design');
  const photographyPosts = await getCollection('photography');

  // Alle Posts zusammenführen
  const allPosts = [
    ...onlineDesignPosts.map((post) => ({
      ...post.data,
      link: `/online-design/${post.slug}/`,
    })),
    ...printDesignPosts.map((post) => ({
      ...post.data,
      link: `/print-design/${post.slug}/`,
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