import { defineCollection, z } from 'astro:content';

import { isLaunchNavigationTarget } from './config/navigation';

const nonEmptyString = z.string().trim().min(1);
const externalUrl = z.string().trim().url();
const optionalExternalUrl = externalUrl.optional();
const portraitAssetSchema = nonEmptyString.refine(
  (value) => value.startsWith('/images/'),
  'Portrait media must stay inside the /images/ static asset boundary',
);
const projectStatusSchema = z.enum(['Deployed', 'In-Development', 'On-Hold', 'Planning']);

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
      primaryCtaLabel: nonEmptyString,
      primaryCtaHref: nonEmptyString.refine(
        (value) => isLaunchNavigationTarget(value),
        'CTA href must be an existing launch navigation target',
      ),
      secondaryCtaLabel: nonEmptyString,
      secondaryCtaHref: nonEmptyString.refine(
        (value) => isLaunchNavigationTarget(value),
        'CTA href must be an existing launch navigation target',
      ),
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
    description: nonEmptyString,
    heading: nonEmptyString,
    intro: nonEmptyString,
    updatedAt: nonEmptyString.regex(/^\d{4}-\d{2}-\d{2}$/, 'updatedAt must use YYYY-MM-DD format'),
    maxAgeDays: z.number().int().positive(),
    downloadName: nonEmptyString,
    viewActionLabel: nonEmptyString,
    downloadActionLabel: nonEmptyString,
    fallbackCopy: nonEmptyString,
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
      status: projectStatusSchema,
      summary: nonEmptyString,
      repositoryUrl: externalUrl,
      liveUrl: optionalExternalUrl,
      sortOrder: z.number().int().nonnegative(),
      seoTitle: nonEmptyString.optional(),
      seoDescription: nonEmptyString.optional(),
    })
    .superRefine((value, ctx) => {
      if (value.status === 'Deployed' && !value.liveUrl) {
        ctx.addIssue({
          code: 'custom',
          message: 'Deployed projects must include liveUrl',
          path: ['liveUrl'],
        });
      }
    }),
});

export const collections = {
  pages,
  posts,
  projects,
  resume,
};
