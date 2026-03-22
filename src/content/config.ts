import fs from 'node:fs';
import path from 'node:path';

import { defineCollection, z } from 'astro:content';

import { isBuiltPageRoute } from '../config/navigation';

const nonEmptyString = z.string().trim().min(1);
const externalUrl = z.string().trim().url();
const optionalExternalUrl = externalUrl.optional();
const reservedNarrativeSectionIds = new Set(['overview', 'problem', 'role']);

const proofSectionSchema = z.object({
  title: nonEmptyString,
  summary: nonEmptyString,
  evidence: z.array(nonEmptyString).min(1),
});

const externalArtifactSchema = z.object({
  label: nonEmptyString,
  href: externalUrl,
  note: nonEmptyString.optional(),
});

const statefulCopySchema = z.object({
  available: nonEmptyString,
  unavailable: nonEmptyString,
});

const resumeHighlightsSchema = z.object({
  title: nonEmptyString,
  availableDescription: nonEmptyString,
  unavailableDescription: nonEmptyString,
});

const storyModuleId = nonEmptyString.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Story module ids must be kebab-case');
const projectAssetRoot = path.join(process.cwd(), 'public');
const portraitAssetSchema = nonEmptyString.refine(
  (value) => value.startsWith('/images/'),
  'Portrait media must stay inside the /images/ static asset boundary',
);

const projectMediaItemSchema = z.object({
  src: nonEmptyString.refine(
    (value) => value.startsWith('/images/projects/') && fs.existsSync(path.join(projectAssetRoot, value.slice(1))),
    'Project media must use the /images/projects/ static asset boundary and point to a real static asset',
  ),
  alt: nonEmptyString,
  caption: nonEmptyString.optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const storyModuleNarrativeSchema = z.object({
  type: z.literal('narrative'),
  id: storyModuleId,
  label: nonEmptyString,
  heading: nonEmptyString,
  content: z.union([nonEmptyString, z.array(nonEmptyString).min(1)]),
});

const storyModuleMediaSchema = z.object({
  type: z.literal('media'),
  id: storyModuleId,
  label: nonEmptyString,
  heading: nonEmptyString,
  summary: nonEmptyString.optional(),
  items: z.array(projectMediaItemSchema).min(1),
});

const pages = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: nonEmptyString,
      description: nonEmptyString,
      seoTitle: nonEmptyString,
      seoDescription: nonEmptyString,
      heroName: nonEmptyString,
      heroRole: nonEmptyString,
      heroIntro: nonEmptyString,
      heroEyebrow: nonEmptyString,
      heroKicker: nonEmptyString,
      heroCredibilityBullets: z.array(nonEmptyString).min(1).max(4),
      heroNextStepCopy: nonEmptyString,
      trustTags: z.array(nonEmptyString).min(1).max(4),
      heroSignalKicker: nonEmptyString,
      heroSignalLabel: nonEmptyString,
      heroSignalCopy: nonEmptyString,
      primaryCtaLabel: nonEmptyString,
      primaryCtaHref: nonEmptyString.refine(
        (value) => value.startsWith('#') || isBuiltPageRoute(value),
        'CTA href must be a same-page anchor or an existing built route',
      ),
      journeyTitle: nonEmptyString,
      journeyIntro: nonEmptyString,
      portraitSrc: portraitAssetSchema.optional(),
      portraitAlt: nonEmptyString.optional(),
    })
    .superRefine((value, ctx) => {
      const hasPortraitSrc = Boolean(value.portraitSrc);
      const hasPortraitAlt = Boolean(value.portraitAlt);

      if (hasPortraitSrc !== hasPortraitAlt) {
        ctx.addIssue({
          code: 'custom',
          message: 'portraitSrc and portraitAlt must be provided together',
          path: hasPortraitSrc ? ['portraitAlt'] : ['portraitSrc'],
        });
      }
    }),
});

const resume = defineCollection({
  type: 'content',
  schema: z.object({
    title: nonEmptyString,
    seoTitle: nonEmptyString,
    eyebrow: nonEmptyString,
    kicker: nonEmptyString,
    heading: nonEmptyString,
    updatedAt: nonEmptyString.regex(/^\d{4}-\d{2}-\d{2}$/, 'updatedAt must use YYYY-MM-DD format'),
    maxAgeDays: z.number().int().positive(),
    downloadName: nonEmptyString,
    viewActionLabel: nonEmptyString,
    downloadActionLabel: nonEmptyString,
    pageDescription: statefulCopySchema,
    primaryIntro: statefulCopySchema,
    secondaryIntro: statefulCopySchema,
    metaItems: z.object({
      available: z.array(nonEmptyString).min(1),
      unavailable: z.array(nonEmptyString).min(1),
    }),
    fallbackTitle: nonEmptyString,
    fallbackCopy: nonEmptyString,
    summaryEyebrow: nonEmptyString,
    summaryHeading: nonEmptyString,
    summaryIntro: statefulCopySchema,
    highlights: z.array(resumeHighlightsSchema).min(1),
    recoveryCopy: nonEmptyString,
    nextStepCopy: nonEmptyString,
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: nonEmptyString,
    summary: nonEmptyString,
    seoTitle: nonEmptyString,
    seoDescription: nonEmptyString,
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: nonEmptyString,
      summary: nonEmptyString,
      context: nonEmptyString,
      overview: nonEmptyString,
      problem: nonEmptyString,
      role: nonEmptyString,
      relevanceCues: z.array(nonEmptyString).min(1).max(4),
      proofSections: z.array(proofSectionSchema).min(2),
      storyModules: z
        .array(z.discriminatedUnion('type', [storyModuleNarrativeSchema, storyModuleMediaSchema]))
        .optional(),
      externalArtifacts: z.array(externalArtifactSchema).optional(),
      liveUrl: optionalExternalUrl,
      repositoryUrl: optionalExternalUrl,
      seoTitle: nonEmptyString,
      seoDescription: nonEmptyString,
    })
    .superRefine((value, ctx) => {
      const storyModules = value.storyModules ?? [];
      const seenIds = new Set<string>();

      storyModules.forEach((module, index) => {
        if (reservedNarrativeSectionIds.has(module.id)) {
          ctx.addIssue({
            code: 'custom',
            message: `Story module id "${module.id}" is reserved for built-in narrative sections`,
            path: ['storyModules', index, 'id'],
          });
        }

        if (seenIds.has(module.id)) {
          ctx.addIssue({
            code: 'custom',
            message: `Story module id "${module.id}" must be unique within a project`,
            path: ['storyModules', index, 'id'],
          });
        }

        seenIds.add(module.id);
      });
    }),
});

export const collections = {
  pages,
  posts,
  projects,
  resume,
};
