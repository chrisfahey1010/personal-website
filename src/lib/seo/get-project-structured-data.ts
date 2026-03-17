import type { ProjectRecord } from '../content/get-projects';

interface StructuredDataNode {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

const toAbsoluteUrl = (path: string, site: URL | string) => new URL(path, site).toString();

export const getProjectStructuredData = (
  project: ProjectRecord,
  site: URL | string,
): StructuredDataNode[] => {
  const pageUrl = toAbsoluteUrl(project.discoverability.canonicalPath, site);
  const projectsUrl = toAbsoluteUrl('/projects/', site);
  const homeUrl = toAbsoluteUrl('/', site);
  const creativeWorkId = `${pageUrl}#project`;
  const proofSections = project.proofSections.map((section) => ({
    '@type': 'CreativeWork',
    headline: section.title,
    description: section.summary,
  }));
  const about = project.relevanceCues.map((cue) => ({
    '@type': 'Thing',
    name: cue,
  }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: project.title,
      description: project.discoverability.seoDescription,
      url: pageUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Chris Fahey',
        url: homeUrl,
      },
      mainEntity: {
        '@id': creativeWorkId,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': creativeWorkId,
      name: project.title,
      headline: project.title,
      description: project.discoverability.seoDescription,
      url: pageUrl,
      author: {
        '@type': 'Person',
        name: 'Chris Fahey',
      },
      about,
      hasPart: proofSections,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: projectsUrl,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: pageUrl,
        },
      ],
    },
  ];
};
