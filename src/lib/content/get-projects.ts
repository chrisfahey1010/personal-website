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

export interface ProjectPreview {
  summary: string;
  context: string;
  relevanceCues: string[];
  href: string;
  ctaLabel: string;
}

export interface ProjectDetailNarrativeSection {
  id: 'overview' | 'problem' | 'role';
  label: string;
  heading: string;
  content: string;
}

export interface ProjectDetail {
  overview: string;
  problem: string;
  role: string;
  narrativeSections: ProjectDetailNarrativeSection[];
  proofSections: ProjectProofSection[];
  externalArtifacts: ProjectExternalArtifact[];
}

export interface ProjectDiscoverability {
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
}

const createNarrativeSections = (entry: CollectionEntry<'projects'>): ProjectDetailNarrativeSection[] => [
  {
    id: 'overview',
    label: 'What this project is',
    heading: 'Evaluator-ready context before you inspect the proof.',
    content: entry.data.overview,
  },
  {
    id: 'problem',
    label: 'Problem framing',
    heading: 'What had to change, and why it mattered.',
    content: entry.data.problem,
  },
  {
    id: 'role',
    label: 'Role and contribution',
    heading: 'Where Chris was directly accountable.',
    content: entry.data.role,
  },
];

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
  preview: ProjectPreview;
  detail: ProjectDetail;
  discoverability: ProjectDiscoverability;
}

const byTitle = (left: ProjectRecord, right: ProjectRecord) => left.title.localeCompare(right.title);

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
        preview: {
          summary: entry.data.summary,
          context: entry.data.context,
          relevanceCues: entry.data.relevanceCues,
          href: `/projects/${slug}/`,
          ctaLabel: `Review ${entry.data.title} proof`,
        },
        detail: {
          overview: entry.data.overview,
          problem: entry.data.problem,
          role: entry.data.role,
          narrativeSections: createNarrativeSections(entry),
          proofSections: entry.data.proofSections,
          externalArtifacts: entry.data.externalArtifacts ?? [],
        },
        discoverability: {
          seoTitle: entry.data.seoTitle,
          seoDescription: entry.data.seoDescription,
          canonicalPath: `/projects/${slug}/`,
        },
      };
    })
    .sort(byTitle);
};

export const getProjectBySlug = async (slug: string): Promise<ProjectRecord | undefined> => {
  const projects = await getProjects();

  return projects.find((project) => project.slug === slug);
};
