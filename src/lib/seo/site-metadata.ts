import { createPageMetadata, type PageMetadata } from './get-page-metadata';

export const defaultSocialImagePath = '/images/share/site-preview.svg';
export const defaultSocialImageAlt = 'Editorial preview card for Chris Fahey portfolio site';

export const launchPageMetadata = {
  projects: createPageMetadata({
    title: 'Projects | Chris Fahey',
    description: 'A scannable project index that helps evaluators compare context, relevance, and where to go next for deeper proof.',
    canonicalPath: '/projects/',
  }),
  resume: createPageMetadata({
    title: 'Resume | Chris Fahey',
    description:
      'A resume entry point that lets evaluators open or download a current PDF without losing orientation across projects and contact.',
    canonicalPath: '/resume/',
  }),
  contact: createPageMetadata({
    title: 'Contact | Chris Fahey',
    description:
      'A calm, low-friction contact page that tells visitors exactly how to reach out and what context makes the follow-up useful.',
    canonicalPath: '/contact/',
  }),
} satisfies Record<'projects' | 'resume' | 'contact', PageMetadata>;
