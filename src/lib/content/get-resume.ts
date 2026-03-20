import fs from 'node:fs';
import path from 'node:path';

import { getEntry } from 'astro:content';

import { launchRoutes } from '../../config/navigation';
import { createPageMetadata } from '../seo/get-page-metadata';
import { launchPageMetadata } from '../seo/site-metadata';

export const resumeAssetPath = '/resume/chris-resume.pdf';

export type ResumeAssetState = 'available' | 'missing' | 'stale';

export type ResumeStatus = {
  assetPath: string;
  sourcePath: string;
  state: ResumeAssetState;
  isAvailable: boolean;
  lastUpdated: string;
  maxAgeDays: number;
};

export type ResumeHighlight = {
  title: string;
  description: string;
};

type ResumeContent = {
  title: string;
  seoTitle: string;
  eyebrow: string;
  kicker: string;
  heading: string;
  updatedAt: string;
  maxAgeDays: number;
  downloadName: string;
  viewActionLabel: string;
  downloadActionLabel: string;
  pageDescription: {
    available: string;
    unavailable: string;
  };
  primaryIntro: {
    available: string;
    unavailable: string;
  };
  secondaryIntro: {
    available: string;
    unavailable: string;
  };
  metaItems: {
    available: string[];
    unavailable: string[];
  };
  fallbackTitle: string;
  fallbackCopy: string;
  summaryEyebrow: string;
  summaryHeading: string;
  summaryIntro: {
    available: string;
    unavailable: string;
  };
  highlights: Array<{
    title: string;
    availableDescription: string;
    unavailableDescription: string;
  }>;
  recoveryCopy: string;
  nextStepCopy: string;
};

export type ResumePageContent = {
  metadata: ReturnType<typeof createPageMetadata>;
  status: ResumeStatus;
  header: {
    eyebrow: string;
    kicker: string;
    heading: string;
    primaryIntro: string;
    secondaryIntro: string;
    metaItems: string[];
  };
  actions: {
    viewLabel: string;
    downloadLabel: string;
    downloadName: string;
    assetPath?: string;
  };
  fallback?: {
    title: string;
    copy: string;
  };
  summary: {
    eyebrow: string;
    heading: string;
    intro: string;
    highlights: ResumeHighlight[];
    recoveryCopy: string;
    nextStepCopy: string;
    backToProjectsHref: string;
    continueToContactHref: string;
  };
};

const resumeAssetSourcePath = path.join(process.cwd(), 'public', resumeAssetPath.slice(1));

const getResumeFreshnessState = (updatedAt: string, maxAgeDays: number): ResumeAssetState => {
  if (!fs.existsSync(resumeAssetSourcePath)) {
    return 'missing';
  }

  const refreshedAt = new Date(`${updatedAt}T00:00:00Z`);

  if (Number.isNaN(refreshedAt.getTime())) {
    throw new Error(`Invalid resume freshness date: ${updatedAt}`);
  }

  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  const ageMs = Date.now() - refreshedAt.getTime();

  return ageMs > maxAgeMs ? 'stale' : 'available';
};

const loadResumeEntry = async () => getEntry('resume', 'overview');

export const getResumePageContent = async (): Promise<ResumePageContent> => {
  const entry = await loadResumeEntry();

  if (!entry) {
    throw new Error('Missing resume content entry.');
  }

  const content: ResumeContent = entry.data;
  const state = getResumeFreshnessState(content.updatedAt, content.maxAgeDays);
  const isAvailable = state === 'available';
  const status: ResumeStatus = {
    assetPath: resumeAssetPath,
    sourcePath: resumeAssetSourcePath,
    state,
    isAvailable,
    lastUpdated: content.updatedAt,
    maxAgeDays: content.maxAgeDays,
  };
  const primaryIntro = isAvailable ? content.primaryIntro.available : content.primaryIntro.unavailable;
  const secondaryIntro = isAvailable
    ? content.secondaryIntro.available
    : `${content.secondaryIntro.unavailable} The resume source was last refreshed on ${status.lastUpdated}.`;

  return {
    metadata: createPageMetadata({
      title: content.seoTitle,
      description: isAvailable ? content.pageDescription.available : content.pageDescription.unavailable,
      canonicalPath: launchPageMetadata.resume.canonicalPath,
      imagePath: launchPageMetadata.resume.imagePath,
      imageAlt: launchPageMetadata.resume.imageAlt,
    }),
    status,
    header: {
      eyebrow: content.eyebrow,
      kicker: content.kicker,
      heading: content.heading,
      primaryIntro,
      secondaryIntro,
      metaItems: isAvailable ? content.metaItems.available : content.metaItems.unavailable,
    },
    actions: {
      viewLabel: content.viewActionLabel,
      downloadLabel: content.downloadActionLabel,
      downloadName: content.downloadName,
      assetPath: isAvailable ? resumeAssetPath : undefined,
    },
    fallback: isAvailable
      ? undefined
      : {
          title: content.fallbackTitle,
          copy: content.fallbackCopy,
        },
    summary: {
      eyebrow: content.summaryEyebrow,
      heading: content.summaryHeading,
      intro: isAvailable ? content.summaryIntro.available : content.summaryIntro.unavailable,
      highlights: content.highlights.map((highlight: ResumeContent['highlights'][number]) => ({
        title: highlight.title,
        description: isAvailable ? highlight.availableDescription : highlight.unavailableDescription,
      })),
      recoveryCopy: content.recoveryCopy,
      nextStepCopy: content.nextStepCopy,
      backToProjectsHref: launchRoutes.projects,
      continueToContactHref: launchRoutes.contact,
    },
  } satisfies ResumePageContent;
};
