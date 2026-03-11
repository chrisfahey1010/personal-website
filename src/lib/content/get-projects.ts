import { getCollection, type CollectionEntry } from 'astro:content';

export interface ProjectRecord {
  entry: CollectionEntry<'projects'>;
  slug: string;
  title: string;
  summary: string;
  context: string;
  relevanceCues: string[];
  seoTitle: string;
  seoDescription: string;
}

const byTitle = (left: ProjectRecord, right: ProjectRecord) => left.title.localeCompare(right.title);

export const getProjects = async (): Promise<ProjectRecord[]> => {
  const entries = await getCollection('projects');

  const slugs = new Set<string>();

  return entries
    .map((entry) => ({
      entry,
      slug: (() => {
        const slug = entry.data.slug ?? entry.slug;

        if (slugs.has(slug)) {
          throw new Error(`Duplicate project slug detected: ${slug}`);
        }

        slugs.add(slug);
        return slug;
      })(),
      title: entry.data.title,
      summary: entry.data.summary,
      context: entry.data.context,
      relevanceCues: entry.data.relevanceCues,
      seoTitle: entry.data.seoTitle,
      seoDescription: entry.data.seoDescription,
    }))
    .sort(byTitle);
};

export const getProjectBySlug = async (slug: string): Promise<ProjectRecord | undefined> => {
  const projects = await getProjects();

  return projects.find((project) => project.slug === slug);
};
