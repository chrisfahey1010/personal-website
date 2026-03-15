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
