import { getEntry, type CollectionEntry } from 'astro:content';

import { createPageMetadata } from '../seo/get-page-metadata';

export interface HomePageHero {
  heroName: string;
  heroRole: string;
  heroIntro: string;
  heroEyebrow: string;
  heroKicker: string;
  heroCredibilityBullets: string[];
  heroNextStepCopy: string;
  trustTags: string[];
  heroSignalKicker: string;
  heroSignalLabel: string;
  heroSignalCopy: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  portraitSrc?: string;
  portraitAlt?: string;
}

export interface HomePageRecord {
  entry: CollectionEntry<'pages'>;
  hero: HomePageHero;
  journeyNextStep: {
    title: string;
    intro: string;
  };
  metadata: ReturnType<typeof createPageMetadata>;
}

export const getHomePage = async (): Promise<HomePageRecord> => {
  const entry = await getEntry('pages', 'home');

  if (!entry) {
    throw new Error('Missing home page content entry.');
  }

  return {
    entry,
    hero: {
      heroName: entry.data.heroName,
      heroRole: entry.data.heroRole,
      heroIntro: entry.data.heroIntro,
      heroEyebrow: entry.data.heroEyebrow,
      heroKicker: entry.data.heroKicker,
      heroCredibilityBullets: entry.data.heroCredibilityBullets,
      heroNextStepCopy: entry.data.heroNextStepCopy,
      trustTags: entry.data.trustTags,
      heroSignalKicker: entry.data.heroSignalKicker,
      heroSignalLabel: entry.data.heroSignalLabel,
      heroSignalCopy: entry.data.heroSignalCopy,
      primaryCtaLabel: entry.data.primaryCtaLabel,
      primaryCtaHref: entry.data.primaryCtaHref,
      portraitSrc: entry.data.portraitSrc,
      portraitAlt: entry.data.portraitAlt,
    },
    journeyNextStep: {
      title: entry.data.journeyTitle,
      intro: entry.data.journeyIntro,
    },
    metadata: createPageMetadata({
      title: entry.data.seoTitle,
      description: entry.data.seoDescription,
      canonicalPath: '/',
    }),
  };
};
