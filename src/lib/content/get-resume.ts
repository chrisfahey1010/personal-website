import fs from 'node:fs';
import path from 'node:path';

export const resumeAssetPath = '/resume/chris-resume.pdf';
const resumeFreshnessUpdatedAt = '2026-03-15';
const resumeFreshnessMaxAgeDays = 548;

export type ResumeHighlight = {
  title: string;
  description: string;
};

export type ResumeAssetState = 'available' | 'missing' | 'stale';

export type ResumeStatus = {
  assetPath: string;
  sourcePath: string;
  state: ResumeAssetState;
  isAvailable: boolean;
  lastUpdated: string;
  maxAgeDays: number;
};

const resumeAssetSourcePath = path.join(process.cwd(), 'public', resumeAssetPath.slice(1));

const getResumeFreshnessState = (): ResumeAssetState => {
  if (!fs.existsSync(resumeAssetSourcePath)) {
    return 'missing';
  }

  const refreshedAt = new Date(`${resumeFreshnessUpdatedAt}T00:00:00Z`);

  if (Number.isNaN(refreshedAt.getTime())) {
    throw new Error(`Invalid resume freshness date: ${resumeFreshnessUpdatedAt}`);
  }

  const maxAgeMs = resumeFreshnessMaxAgeDays * 24 * 60 * 60 * 1000;
  const ageMs = Date.now() - refreshedAt.getTime();

  return ageMs > maxAgeMs ? 'stale' : 'available';
};

export const getResumeStatus = (): ResumeStatus => {
  const state = getResumeFreshnessState();

  return {
    assetPath: resumeAssetPath,
    sourcePath: resumeAssetSourcePath,
    state,
    isAvailable: state === 'available',
    lastUpdated: resumeFreshnessUpdatedAt,
    maxAgeDays: resumeFreshnessMaxAgeDays,
  };
};

export const hasResumeAsset = () => getResumeStatus().isAvailable;

export const getResumeAssetPath = () => {
  const resumeStatus = getResumeStatus();

  if (!resumeStatus.isAvailable) {
    throw new Error(
      `Canonical resume asset is not available for visitors (${resumeStatus.state}) at ${resumeStatus.sourcePath}`,
    );
  }

  return resumeAssetPath;
};

export const getResumeHighlights = (): ResumeHighlight[] => [
  {
    title: 'What you can review',
    description: hasResumeAsset()
      ? 'A current PDF resume that captures formal experience, delivery context, and the scope behind recent product engineering work.'
      : 'A resume summary that captures the core experience, delivery context, and the scope behind recent product engineering work while the canonical PDF is unavailable.',
  },
  {
    title: 'Why this page exists',
    description: 'Resume review stays connected to the same evaluation flow as projects, so the handoff feels deliberate instead of abrupt.',
  },
  {
    title: 'What to do next',
    description: hasResumeAsset()
      ? 'Use the projects route for more proof or the contact route if you want the latest context, a tailored walkthrough, or a direct conversation.'
      : 'Use the projects route for more proof or the contact route if you want the latest copy, a tailored walkthrough, or a direct conversation.',
  },
];
