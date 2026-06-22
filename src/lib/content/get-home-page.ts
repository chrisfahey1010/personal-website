import fs from 'node:fs';
import path from 'node:path';

import { getEntry } from 'astro:content';

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
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  portraitSrc?: string;
  portraitAlt?: string;
}

export interface HomePageRecord {
  hero: HomePageHero;
  metadata: ReturnType<typeof createPageMetadata>;
}

export const getHomePage = async (): Promise<HomePageRecord> => {
  const entry = await getEntry('pages', 'home');

  if (!entry) {
    throw new Error('Missing home page content entry.');
  }

  const portrait = resolvePortrait(entry.data.portraitSrc, entry.data.portraitAlt);

  return {
    hero: {
      heroName: entry.data.heroName,
      heroRole: entry.data.heroRole,
      heroIntro: entry.data.heroIntro,
      primaryCtaLabel: entry.data.primaryCtaLabel,
      primaryCtaHref: entry.data.primaryCtaHref,
      secondaryCtaLabel: entry.data.secondaryCtaLabel,
      secondaryCtaHref: entry.data.secondaryCtaHref,
      portraitSrc: portrait.portraitSrc,
      portraitAlt: portrait.portraitAlt,
    },
    metadata: createPageMetadata({
      title: entry.data.seoTitle,
      description: entry.data.seoDescription,
      canonicalPath: '/',
    }),
  };
};
