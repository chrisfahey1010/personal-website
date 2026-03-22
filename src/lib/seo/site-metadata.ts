import {
  createPageMetadata,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_PATH,
  type PageMetadata,
} from './get-page-metadata';

export const launchPageMetadata = {
  projects: createPageMetadata({
    title: 'Projects | Chris Fahey',
    description: 'A scannable project index that helps hiring teams compare context, role, outcomes, and the next relevant page.',
    canonicalPath: '/projects/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
  resume: createPageMetadata({
    title: 'Resume | Chris Fahey',
    description:
      'A resume entry point that lets visitors open or download a current PDF without losing orientation across projects and contact.',
    canonicalPath: '/resume/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
  contact: createPageMetadata({
    title: 'Contact | Chris Fahey',
    description:
      'A calm, low-friction contact page that tells visitors exactly how to reach out and what context makes the follow-up useful.',
    canonicalPath: '/contact/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
} satisfies Record<'projects' | 'resume' | 'contact', PageMetadata>;
