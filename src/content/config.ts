import { defineCollection, z } from 'astro:content';

import { isBuiltPageRoute } from '../config/navigation';

const nonEmptyString = z.string().trim().min(1);
const externalUrl = z.string().trim().url();
const optionalExternalUrl = externalUrl.optional();

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

const pages = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: nonEmptyString,
      description: nonEmptyString,
      seoTitle: nonEmptyString.optional(),
      seoDescription: nonEmptyString.optional(),
      heroName: nonEmptyString,
      heroRole: nonEmptyString,
      heroIntro: nonEmptyString,
      trustTags: z.array(nonEmptyString).min(1).max(4),
      primaryCtaLabel: nonEmptyString,
      primaryCtaHref: nonEmptyString.refine(
        (value) => value.startsWith('#') || isBuiltPageRoute(value),
        'CTA href must be a same-page anchor or an existing built route',
      ),
      portraitSrc: nonEmptyString.optional(),
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

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: nonEmptyString,
    summary: nonEmptyString,
    context: nonEmptyString,
    overview: nonEmptyString,
    problem: nonEmptyString,
    role: nonEmptyString,
    relevanceCues: z.array(nonEmptyString).min(1).max(4),
    proofSections: z.array(proofSectionSchema).min(2),
    externalArtifacts: z.array(externalArtifactSchema).optional(),
    liveUrl: optionalExternalUrl,
    repositoryUrl: optionalExternalUrl,
    seoTitle: nonEmptyString,
    seoDescription: nonEmptyString,
  }),
});

export const collections = {
  pages,
  projects,
};
