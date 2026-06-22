import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectStatus = 'Deployed' | 'In-Development' | 'On-Hold' | 'Planning';

export interface ProjectRecord {
  entry: CollectionEntry<'projects'>;
  slug: string;
  title: string;
  status: ProjectStatus;
  summary: string;
  repositoryUrl: string;
  liveUrl?: string;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
}

const bySortOrder = (left: ProjectRecord, right: ProjectRecord) =>
  left.sortOrder - right.sortOrder || left.title.localeCompare(right.title);

export const getProjects = async (): Promise<ProjectRecord[]> => {
  const entries = await getCollection('projects');
  const slugs = new Set<string>();

  return entries
    .map((entry) => {
      const slug = entry.slug;

      if (slugs.has(slug)) {
        throw new Error(`Duplicate project slug detected: ${slug}`);
      }

      slugs.add(slug);

      return {
        entry,
        slug,
        title: entry.data.title,
        status: entry.data.status,
        summary: entry.data.summary,
        repositoryUrl: entry.data.repositoryUrl,
        liveUrl: entry.data.liveUrl,
        sortOrder: entry.data.sortOrder,
        seoTitle: entry.data.seoTitle ?? `${entry.data.title} | Chris Fahey Projects`,
        seoDescription: entry.data.seoDescription ?? entry.data.summary,
      } satisfies ProjectRecord;
    })
    .sort(bySortOrder);
};
