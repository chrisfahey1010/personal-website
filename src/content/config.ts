import { defineCollection, z } from 'astro:content';

const nonEmptyString = z.string().trim().min(1);
const builtPageRoutes = new Set(['/']);

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
        (value) => value.startsWith('#') || builtPageRoutes.has(value),
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

export const collections = {
  pages,
};
