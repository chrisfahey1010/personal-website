import { z } from 'zod';

import { decisionInputSchema, sourceReferenceSchema } from '../lib/buddha/types';

const preparedAt = '2026-08-10T00:00:00.000Z';
const nonEmptyString = z.string().trim().min(1);

export const publicProductSchema = z.strictObject({
  provenance: z.literal('public'),
  handle: nonEmptyString,
  name: nonEmptyString,
  material: nonEmptyString,
  gemstone: nonEmptyString,
  cuts: z.array(nonEmptyString).min(1),
  publicVariants: z.array(nonEmptyString).min(1),
  storefrontAvailable: z.boolean(),
  publicDescriptionExcerpt: nonEmptyString,
  source: sourceReferenceSchema,
});

export const publicCatalogFixtureSchema = z.array(publicProductSchema).min(1);

export const productExtractionReplaySchema = z.strictObject({
  provenance: z.literal('synthetic'),
  productHandle: nonEmptyString,
  status: z.literal('AI-assisted draft — human verification required'),
  replayNote: nonEmptyString,
});

const operationalScenarioSchema = z.strictObject({
  id: z.enum(['baseline', 'longer-lead-time', 'demand-increase']),
  label: z.enum(['Baseline', 'Longer supplier lead time', 'Demand increase']),
  description: nonEmptyString,
  provenance: z.literal('synthetic'),
  input: decisionInputSchema,
});

export const operationalScenariosSchema = z
  .array(operationalScenarioSchema)
  .length(3)
  .superRefine((scenarios, context) => {
    const expectedIds: Set<(typeof scenarios)[number]['id']> = new Set([
      'baseline',
      'longer-lead-time',
      'demand-increase',
    ]);
    const actualIds = new Set(scenarios.map(({ id }) => id));

    if (actualIds.size !== expectedIds.size || [...expectedIds].some((id) => !actualIds.has(id))) {
      context.addIssue({
        code: 'custom',
        message: 'Operational scenarios must include each declared scenario exactly once',
      });
    }
  });

export const queueSignalsSchema = z.strictObject({
  availabilityReview: z.strictObject({
    provenance: z.literal('synthetic'),
    productHandle: nonEmptyString,
    scenarioAvailableForAllocation: z.boolean(),
  }),
  blockedReview: z.strictObject({
    provenance: z.literal('synthetic'),
    input: decisionInputSchema,
  }),
});

export const studioScenarioSchema = z.strictObject({
  provenance: z.literal('synthetic'),
  fictional: z.literal(true),
  accountName: z.enum(['Demo Studio North', 'Demo Studio West']),
  reorderWindow: nonEmptyString,
  productFamilyAffinity: nonEmptyString,
  supportSignal: nonEmptyString,
  proposedNextAction: nonEmptyString,
  futureHumanReviewedAction: nonEmptyString,
  missingInputs: z.array(nonEmptyString).min(1),
});

export const studioScenariosSchema = z
  .array(studioScenarioSchema)
  .length(2)
  .refine(
    (scenarios) => new Set(scenarios.map(({ accountName }) => accountName)).size === scenarios.length,
    { message: 'Studio opportunities must reference distinct fictional accounts' },
  );

export const gemstoneOutlookSchema = z.strictObject({
  provenance: z.literal('synthetic'),
  gemstone: nonEmptyString,
  last30DayCarats: z.number().finite().positive(),
  previous30DayCarats: z.number().finite().positive(),
});

export const gemstoneOutlookListSchema = z.array(gemstoneOutlookSchema).length(4);

export const metalDemandSchema = z.strictObject({
  provenance: z.literal('synthetic'),
  metal: nonEmptyString,
  last30DayGrams: z.number().finite().positive(),
  previous30DayGrams: z.number().finite().positive(),
});

export const metalDemandListSchema = z.array(metalDemandSchema).length(4);

export const salesPaceSchema = z.strictObject({
  provenance: z.literal('synthetic'),
  period: nonEmptyString,
  actualUnits: z.number().finite().nonnegative(),
  targetUnits: z.number().finite().positive(),
});

export const marketSignalSchema = z.strictObject({
  id: nonEmptyString,
  title: nonEmptyString,
  provenance: z.literal('public'),
  observation: nonEmptyString,
  possibleImplication: nonEmptyString,
  caveat: nonEmptyString,
  source: sourceReferenceSchema,
});

export const publicMarketSignalsSchema = z.array(marketSignalSchema).min(2).max(3);

export const buddhaDemoFixtureSchema = z
  .strictObject({
    publicCatalog: publicCatalogFixtureSchema,
    productExtraction: productExtractionReplaySchema,
    operationalScenarios: operationalScenariosSchema,
    queueSignals: queueSignalsSchema,
    studioScenarios: studioScenariosSchema,
    gemstoneOutlook: gemstoneOutlookListSchema,
    metalDemand: metalDemandListSchema,
    salesPace: salesPaceSchema,
    marketSignals: publicMarketSignalsSchema,
  })
  .superRefine((fixture, context) => {
    const catalogHandles = new Set(fixture.publicCatalog.map(({ handle }) => handle));
    const productReferences: Array<{ handle: string; path: Array<string | number> }> = [
      ...fixture.operationalScenarios.map(({ input }, index) => ({
        handle: input.productHandle,
        path: ['operationalScenarios', index, 'input', 'productHandle'],
      })),
      {
        handle: fixture.productExtraction.productHandle,
        path: ['productExtraction', 'productHandle'],
      },
      {
        handle: fixture.queueSignals.availabilityReview.productHandle,
        path: ['queueSignals', 'availabilityReview', 'productHandle'],
      },
      {
        handle: fixture.queueSignals.blockedReview.input.productHandle,
        path: ['queueSignals', 'blockedReview', 'input', 'productHandle'],
      },
    ];

    productReferences.forEach(({ handle, path }) => {
      if (!catalogHandles.has(handle)) {
        context.addIssue({
          code: 'custom',
          message: `Scenario references unknown public product handle: ${handle}`,
          path,
        });
      }
    });
  });

export const publicCatalogFixture = publicCatalogFixtureSchema.parse([
  {
    provenance: 'public',
    handle: 'anais-clicker-with-blue-sapphire-lab-grown',
    name: 'Anaïs Clicker with Blue Sapphire (Lab Grown)',
    material: 'Solid 14k gold',
    gemstone: 'Lab-grown blue sapphire',
    cuts: ['Round', 'Marquise'],
    publicVariants: ['Yellow gold', 'White gold', 'Rose gold'],
    storefrontAvailable: true,
    publicDescriptionExcerpt:
      'The public description identifies solid 14k gold, lab-grown blue sapphires, and round and marquise cuts.',
    source: {
      label: 'Buddha Jewelry public product record',
      url: 'https://www.buddhajewelry.com/products/anais-clicker-with-blue-sapphire-lab-grown.json',
      observedAt: preparedAt,
      provenance: 'public',
    },
  },
]);

export const productExtractionReplay = productExtractionReplaySchema.parse({
  provenance: 'synthetic',
  productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
  status: 'AI-assisted draft — human verification required',
  replayNote:
    'A curated replay of structured extraction output; no model is called at build time or in the browser.',
});

export const syntheticOperationalScenarios = operationalScenariosSchema.parse([
  {
    id: 'baseline',
    label: 'Baseline',
    description: 'Generated planning baseline with a modest coverage gap.',
    provenance: 'synthetic',
    input: {
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 15,
      openPurchaseOrderUnits: 0,
      supplierLeadTimeDays: 12,
      safetyStockDays: 4,
    },
  },
  {
    id: 'longer-lead-time',
    label: 'Longer supplier lead time',
    description: 'The same generated record with supplier lead time extended to 20 days.',
    provenance: 'synthetic',
    input: {
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 15,
      openPurchaseOrderUnits: 0,
      supplierLeadTimeDays: 20,
      safetyStockDays: 4,
    },
  },
  {
    id: 'demand-increase',
    label: 'Demand increase',
    description: 'The same generated record with average daily demand increased by 50%.',
    provenance: 'synthetic',
    input: {
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1.5,
      availableUnits: 15,
      openPurchaseOrderUnits: 0,
      supplierLeadTimeDays: 12,
      safetyStockDays: 4,
    },
  },
]);

export const syntheticQueueSignals = queueSignalsSchema.parse({
  availabilityReview: {
    provenance: 'synthetic',
    productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
    scenarioAvailableForAllocation: false,
  },
  blockedReview: {
    provenance: 'synthetic',
    input: {
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 0.9,
      availableUnits: 11,
    },
  },
});

export const syntheticStudioScenarios = studioScenariosSchema.parse([
  {
    provenance: 'synthetic',
    fictional: true,
    accountName: 'Demo Studio North',
    reorderWindow: 'Next 14 days',
    productFamilyAffinity: 'Blue-sapphire clickers',
    supportSignal: 'Generated pattern: reorder cadence may be later than the scenario baseline',
    proposedNextAction: 'Ask the account owner to review assortment needs before the next reorder window.',
    futureHumanReviewedAction:
      'Draft an email or assortment recommendation for human review; never send automatically.',
    missingInputs: [
      'Account hierarchy',
      'Order history',
      'Support history',
      'Account owner',
      'Consent and communication preferences',
    ],
  },
  {
    provenance: 'synthetic',
    fictional: true,
    accountName: 'Demo Studio West',
    reorderWindow: 'Next 21 days',
    productFamilyAffinity: 'Rose-gold clickers',
    supportSignal: 'Generated pattern: recent assortment interest may support a follow-up review',
    proposedNextAction: 'Ask the account owner to review rose-gold clicker options before the next assortment review.',
    futureHumanReviewedAction:
      'Draft a tailored assortment follow-up for human review; never send automatically.',
    missingInputs: [
      'Account hierarchy',
      'Order history',
      'Support history',
      'Account owner',
      'Consent and communication preferences',
    ],
  },
]);

export const syntheticGemstoneOutlook = gemstoneOutlookListSchema.parse([
  {
    provenance: 'synthetic',
    gemstone: 'Blue sapphire',
    last30DayCarats: 472,
    previous30DayCarats: 400,
  },
  {
    provenance: 'synthetic',
    gemstone: 'Diamond',
    last30DayCarats: 324,
    previous30DayCarats: 300,
  },
  {
    provenance: 'synthetic',
    gemstone: 'Emerald',
    last30DayCarats: 194,
    previous30DayCarats: 200,
  },
  {
    provenance: 'synthetic',
    gemstone: 'Opal',
    last30DayCarats: 168,
    previous30DayCarats: 160,
  },
]);

export const syntheticMetalDemand = metalDemandListSchema.parse([
  {
    provenance: 'synthetic',
    metal: 'Yellow gold',
    last30DayGrams: 1480,
    previous30DayGrams: 1370,
  },
  {
    provenance: 'synthetic',
    metal: 'White gold',
    last30DayGrams: 1125,
    previous30DayGrams: 1150,
  },
  {
    provenance: 'synthetic',
    metal: 'Rose gold',
    last30DayGrams: 845,
    previous30DayGrams: 780,
  },
  {
    provenance: 'synthetic',
    metal: 'Titanium',
    last30DayGrams: 510,
    previous30DayGrams: 480,
  },
]);

export const syntheticSalesPace = salesPaceSchema.parse({
  provenance: 'synthetic',
  period: 'Month to date',
  actualUnits: 92,
  targetUnits: 100,
});

export const publicMarketSignals = publicMarketSignalsSchema.parse([
  {
    id: 'agent-commerce-instructions',
    title: 'Agent-commerce instructions are publicly documented',
    provenance: 'public',
    observation:
      'Buddha publishes agent-facing commerce instructions that describe read-only catalog paths and buyer approval before payment.',
    possibleImplication:
      'Structured public catalog access could be evaluated as one input to controlled product discovery workflows.',
    caveat:
      'The public instructions describe a capability; they do not establish adoption, transaction volume, or performance.',
    source: {
      label: 'Buddha Jewelry agent instructions',
      url: 'https://www.buddhajewelry.com/agents.md',
      observedAt: preparedAt,
      provenance: 'public',
    },
  },
  {
    id: 'app-about',
    title: 'APP frames standards, safety, and education',
    provenance: 'public',
    observation:
      'APP describes itself as an international nonprofit professional alliance focused on piercing health, safety, information, and education.',
    possibleImplication:
      'Standards and education themes are useful ecosystem signals for product, support, and partnership planning.',
    caveat:
      'APP is an industry association and ecosystem signal—not a direct competitor or a measure of company performance.',
    source: {
      label: 'Association of Professional Piercers — About',
      url: 'https://safepiercing.org/about/',
      observedAt: preparedAt,
      provenance: 'public',
    },
  },
  {
    id: 'app-corporate-sponsors',
    title: 'Public sponsor directories expose ecosystem relationships',
    provenance: 'public',
    observation:
      'APP’s public corporate sponsor directory lists Buddha Jewelry Organics among organizations supporting the piercing field.',
    possibleImplication:
      'Public relationship directories can help teams map ecosystem participants for human review.',
    caveat:
      'A sponsor listing proves sponsorship only; it does not establish endorsement, sales, market share, or competitive rank.',
    source: {
      label: 'Association of Professional Piercers — Corporate sponsors',
      url: 'https://safepiercing.org/about/corporate-sponsors/',
      observedAt: preparedAt,
      provenance: 'public',
    },
  },
]);

buddhaDemoFixtureSchema.parse({
  publicCatalog: publicCatalogFixture,
  productExtraction: productExtractionReplay,
  operationalScenarios: syntheticOperationalScenarios,
  queueSignals: syntheticQueueSignals,
  studioScenarios: syntheticStudioScenarios,
  gemstoneOutlook: syntheticGemstoneOutlook,
  metalDemand: syntheticMetalDemand,
  salesPace: syntheticSalesPace,
  marketSignals: publicMarketSignals,
});
