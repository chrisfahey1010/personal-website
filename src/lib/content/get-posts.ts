import { getCollection, type CollectionEntry } from 'astro:content';

export interface PostDiscoverability {
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  openGraphType: 'article';
}

export interface PostRecord {
  entry: CollectionEntry<'posts'>;
  slug: string;
  title: string;
  summary: string;
  discoverability: PostDiscoverability;
}

const byTitle = (left: PostRecord, right: PostRecord) => left.title.localeCompare(right.title);

export const getPosts = async (): Promise<PostRecord[]> => {
  const entries = await getCollection('posts', ({ data }) => !data.draft);

  return entries
    .map((entry) => {
      const slug = entry.slug;

      return {
        entry,
        slug,
        title: entry.data.title,
        summary: entry.data.summary,
        discoverability: {
          seoTitle: entry.data.seoTitle,
          seoDescription: entry.data.seoDescription,
          canonicalPath: `/posts/${slug}/`,
          openGraphType: 'article',
        },
      } satisfies PostRecord;
    })
    .sort(byTitle);
};

export const getPostBySlug = async (slug: string): Promise<PostRecord | undefined> => {
  const posts = await getPosts();

  return posts.find((post) => post.slug === slug);
};
