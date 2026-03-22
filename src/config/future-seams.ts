import { launchNavigationItems, type NavigationItem } from './navigation';

type LaunchNavigationLabel = NavigationItem['label'];
type ReservedFutureContentArea = 'Posts' | 'Writing' | 'Blog';

export const launchNavigationLabels = launchNavigationItems.map((item) => item.label) as readonly LaunchNavigationLabel[];

const launchNavigationLabelSet = new Set<LaunchNavigationLabel>(launchNavigationLabels);
const reservedFutureContentAreaSet = new Set<ReservedFutureContentArea>(['Posts', 'Writing', 'Blog']);
const launchNavigationSummary = launchNavigationLabels.join(', ');

export const launchScopeAreas = [
  'homepage',
  'projects',
  'resume',
  'contact',
  'accessibility',
  'SEO',
  'deployment-ready foundations',
] as const;

export const reservedFutureContentAreas = [...reservedFutureContentAreaSet] as const;

export const canonicalAuthoredContentRoot = 'src/content';
export const contentSchemaBoundary = 'src/content/config.ts';
export const contentNormalizationLayer = 'src/lib/content';
export const futureIntegrationAdapterDirectory = 'src/lib/integrations';
export const futureApiDirectory = 'src/pages/api';

export const isLaunchNavigationLabel = (label: string): label is LaunchNavigationLabel =>
  launchNavigationLabelSet.has(label as LaunchNavigationLabel);

export const isReservedFutureContentArea = (label: string): label is ReservedFutureContentArea =>
  reservedFutureContentAreaSet.has(label as ReservedFutureContentArea);

export const cmsMappingRequirement =
  'Any future CMS or external content source must map into the existing src/content domain model before pages consume it.';

export const launchRouteBoundary =
  'Launch pages compose shaped content and must not own integration fetch logic.';

export const shellBoundary =
  'Global shell metadata and navigation must stay independent from optional integrations.';

export const futureSeamStatus = [
  'No published posts are live yet, so this surface stays intentionally quiet.',
  `Launch navigation remains focused on ${launchNavigationSummary}.`,
  'Future published entries can plug into this route without redefining the site\'s discoverability model.',
] as const;
