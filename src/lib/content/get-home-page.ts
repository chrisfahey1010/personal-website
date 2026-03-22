import fs from 'node:fs';
import path from 'node:path';

import { getEntry, type CollectionEntry } from 'astro:content';

import { createPageMetadata } from '../seo/get-page-metadata';

const publicAssetRoot = path.join(process.cwd(), 'public');

const resolvePortrait = (portraitSrc?: string, portraitAlt?: string) => {
  if (!portraitSrc || !portraitAlt) {
    return { portraitSrc: undefined, portraitAlt: undefined };
  }

  const portraitFilePath = path.join(publicAssetRoot, portraitSrc.slice(1));

  if (!fs.existsSync(portraitFilePath)) {
    return { portraitSrc: undefined, portraitAlt: undefined };
  }

  return { portraitSrc, portraitAlt };
};

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

  const portrait = resolvePortrait(entry.data.portraitSrc, entry.data.portraitAlt);

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
      portraitSrc: portrait.portraitSrc,
      portraitAlt: portrait.portraitAlt,
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
