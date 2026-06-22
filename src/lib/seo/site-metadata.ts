import {
  createPageMetadata,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_PATH,
  type PageMetadata,
} from './get-page-metadata';

export const launchPageMetadata = {
  projects: createPageMetadata({
    title: 'Projects | Chris Fahey',
    description: 'Selected software projects by Chris Fahey, including deployed web apps, game projects, AI tooling, and data pipelines.',
    canonicalPath: '/projects/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
  resume: createPageMetadata({
    title: 'Resume | Chris Fahey',
    description: "Open or download Chris Fahey's current software engineering resume.",
    canonicalPath: '/resume/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
  contact: createPageMetadata({
    title: 'Contact | Chris Fahey',
    description: 'Contact Chris Fahey about software engineering roles, projects, or consulting work.',
    canonicalPath: '/contact/',
    imagePath: DEFAULT_SOCIAL_IMAGE_PATH,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  }),
} satisfies Record<'projects' | 'resume' | 'contact', PageMetadata>;
