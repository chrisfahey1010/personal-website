import { getCollection, type CollectionEntry } from 'astro:content';

export interface ProjectProofSection {
  title: string;
  summary: string;
  evidence: string[];
}

export interface ProjectExternalArtifact {
  label: string;
  href: string;
  note?: string;
}

export interface ProjectRecord {
  entry: CollectionEntry<'projects'>;
  slug: string;
  title: string;
  summary: string;
  context: string;
  overview: string;
  problem: string;
  role: string;
  relevanceCues: string[];
  proofSections: ProjectProofSection[];
  externalArtifacts: ProjectExternalArtifact[];
  liveUrl?: string;
  repositoryUrl?: string;
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
      overview: entry.data.overview,
      problem: entry.data.problem,
      role: entry.data.role,
      relevanceCues: entry.data.relevanceCues,
      proofSections: entry.data.proofSections,
      externalArtifacts: entry.data.externalArtifacts ?? [],
      liveUrl: entry.data.liveUrl,
      repositoryUrl: entry.data.repositoryUrl,
      seoTitle: entry.data.seoTitle,
      seoDescription: entry.data.seoDescription,
    }))
    .sort(byTitle);
};

export const getProjectBySlug = async (slug: string): Promise<ProjectRecord | undefined> => {
  const projects = await getProjects();

  return projects.find((project) => project.slug === slug);
};
