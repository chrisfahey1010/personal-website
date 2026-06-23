import fs from 'node:fs';
import path from 'node:path';

import { getEntry } from 'astro:content';

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

export type ResumePageContent = {
  status: ResumeStatus;
  heading: string;
  intro: string;
  actions: {
    viewLabel: string;
    downloadLabel: string;
    downloadName: string;
    assetPath?: string;
  };
  fallbackCopy: string;
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

  const content = entry.data;
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

  return {
    status,
    heading: content.heading,
    intro: content.intro,
    actions: {
      viewLabel: content.viewActionLabel,
      downloadLabel: content.downloadActionLabel,
      downloadName: content.downloadName,
      assetPath: isAvailable ? resumeAssetPath : undefined,
    },
    fallbackCopy: content.fallbackCopy,
  } satisfies ResumePageContent;
};
