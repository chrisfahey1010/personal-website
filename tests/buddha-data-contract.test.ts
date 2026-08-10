import { describe, expect, it } from 'vitest';

import {
  decisionInputSchema,
  evidenceItemSchema,
  provenanceKindSchema,
  provenanceKinds,
  sourceReferenceSchema,
} from '../src/lib/buddha/types';
import {
  buddhaDemoFixtureSchema,
  publicCatalogFixture,
  publicMarketSignals,
  productExtractionReplay,
  syntheticGemstoneOutlook,
  syntheticMetalDemand,
  syntheticOperationalScenarios,
  syntheticQueueSignals,
  syntheticSalesPace,
  syntheticStudioScenarios,
} from '../src/data/buddha-demo';

function collectKeys(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectKeys);
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nestedValue]) => [key, ...collectKeys(nestedValue)]);
  }

  return [];
}

describe('Buddha demo data contracts', () => {
  it('uses exactly the four promised provenance values', () => {
    expect(provenanceKinds).toEqual(['public', 'synthetic', 'derived', 'missing']);
    expect(provenanceKindSchema.safeParse('estimated').success).toBe(false);
  });

  it('requires public sources to have HTTPS URLs and observed timestamps', () => {
    const validSource = {
      label: 'Public product record',
      url: 'https://www.buddhajewelry.com/products/example.json',
      observedAt: '2026-08-02T00:00:00.000Z',
      provenance: 'public',
    };

    expect(sourceReferenceSchema.safeParse(validSource).success).toBe(true);
    expect(sourceReferenceSchema.safeParse({ ...validSource, url: 'http://example.com' }).success).toBe(false);
    expect(sourceReferenceSchema.safeParse({ ...validSource, observedAt: '' }).success).toBe(false);
  });

  it('requires every public evidence item to carry its source', () => {
    const publicEvidenceWithoutSource = {
      label: 'Public availability',
      value: 'Available to purchase',
      provenance: 'public',
    };

    expect(evidenceItemSchema.safeParse(publicEvidenceWithoutSource).success).toBe(false);
    expect(
      evidenceItemSchema.safeParse({
        ...publicEvidenceWithoutSource,
        provenance: 'derived',
      }).success,
    ).toBe(true);
  });

  it('rejects negative and non-finite decision inputs', () => {
    const baseInput = {
      productHandle: 'example-product',
      averageDailyUnits: 1,
      availableUnits: 10,
      openPurchaseOrderUnits: 2,
      supplierLeadTimeDays: 14,
      safetyStockDays: 5,
    };

    for (const field of [
      'averageDailyUnits',
      'availableUnits',
      'openPurchaseOrderUnits',
      'supplierLeadTimeDays',
      'safetyStockDays',
    ] as const) {
      expect(decisionInputSchema.safeParse({ ...baseInput, [field]: -1 }).success).toBe(false);
      expect(decisionInputSchema.safeParse({ ...baseInput, [field]: Number.NaN }).success).toBe(false);
      expect(
        decisionInputSchema.safeParse({ ...baseInput, [field]: Number.POSITIVE_INFINITY }).success,
      ).toBe(false);
    }
  });
});

describe('curated Buddha demo fixtures', () => {
  const fixtureBundle = {
    publicCatalog: publicCatalogFixture,
    productExtraction: productExtractionReplay,
    operationalScenarios: syntheticOperationalScenarios,
    queueSignals: syntheticQueueSignals,
    studioScenarios: syntheticStudioScenarios,
    gemstoneOutlook: syntheticGemstoneOutlook,
    metalDemand: syntheticMetalDemand,
    salesPace: syntheticSalesPace,
    marketSignals: publicMarketSignals,
  };

  it('gives every public record an HTTPS source and observed timestamp', () => {
    const publicRecords = [...publicCatalogFixture, ...publicMarketSignals];

    for (const record of publicRecords) {
      expect(record.provenance).toBe('public');
      expect(record.source.url).toMatch(/^https:\/\//);
      expect(Number.isNaN(Date.parse(record.source.observedAt))).toBe(false);
    }
  });

  it('marks the three operational scenarios as synthetic', () => {
    expect(syntheticOperationalScenarios.map(({ id }) => id)).toEqual([
      'baseline',
      'longer-lead-time',
      'demand-increase',
    ]);
    expect(syntheticOperationalScenarios.every(({ provenance }) => provenance === 'synthetic')).toBe(
      true,
    );
    expect(syntheticQueueSignals.availabilityReview.provenance).toBe('synthetic');
    expect(syntheticQueueSignals.blockedReview.provenance).toBe('synthetic');
  });

  it('provides explicit paired 30-day synthetic gemstone weight volumes', () => {
    expect(syntheticGemstoneOutlook).toHaveLength(4);
    expect(syntheticGemstoneOutlook.every(({ provenance }) => provenance === 'synthetic')).toBe(true);
    expect(syntheticGemstoneOutlook.map(({ gemstone }) => gemstone)).toEqual([
      'Blue sapphire',
      'Diamond',
      'Emerald',
      'Opal',
    ]);

    for (const record of syntheticGemstoneOutlook) {
      expect(record.last30DayCarats).toBeGreaterThan(0);
      expect(record.previous30DayCarats).toBeGreaterThan(0);
      expect(record).not.toHaveProperty('demandIndex');
      expect(record).not.toHaveProperty('changePercent');
    }

    const periodChanges = syntheticGemstoneOutlook.map(
      ({ last30DayCarats, previous30DayCarats }) =>
        Math.round(((last30DayCarats - previous30DayCarats) / previous30DayCarats) * 100),
    );
    expect(periodChanges).toEqual([18, 8, -3, 5]);
  });

  it('provides explicit paired 30-day synthetic metal weight volumes', () => {
    expect(syntheticMetalDemand).toHaveLength(4);
    expect(syntheticMetalDemand.every(({ provenance }) => provenance === 'synthetic')).toBe(true);
    expect(syntheticMetalDemand.map(({ metal }) => metal)).toEqual([
      'Yellow gold',
      'White gold',
      'Rose gold',
      'Titanium',
    ]);

    for (const record of syntheticMetalDemand) {
      expect(record.last30DayGrams).toBeGreaterThan(0);
      expect(record.previous30DayGrams).toBeGreaterThan(0);
      expect(record).not.toHaveProperty('changePercent');
    }

    const periodChanges = syntheticMetalDemand.map(
      ({ last30DayGrams, previous30DayGrams }) =>
        Math.round(((last30DayGrams - previous30DayGrams) / previous30DayGrams) * 100),
    );
    expect(periodChanges).toEqual([8, -2, 8, 6]);
  });

  it('provides an explicitly synthetic sales goal comparison', () => {
    expect(syntheticSalesPace.provenance).toBe('synthetic');
    expect(syntheticSalesPace.period).toBe('Month to date');
    expect(syntheticSalesPace.actualUnits).toBeGreaterThanOrEqual(0);
    expect(syntheticSalesPace.targetUnits).toBeGreaterThan(0);
    expect(syntheticSalesPace.actualUnits).toBeLessThan(syntheticSalesPace.targetUnits);
  });

  it('makes both studio accounts unmistakably fictional', () => {
    expect(syntheticStudioScenarios).toHaveLength(2);
    expect(syntheticStudioScenarios.every(({ provenance }) => provenance === 'synthetic')).toBe(true);
    expect(syntheticStudioScenarios.every(({ fictional }) => fictional)).toBe(true);
    expect(syntheticStudioScenarios.map(({ accountName }) => accountName)).toEqual([
      'Demo Studio North',
      'Demo Studio West',
    ]);
  });

  it('uses storefrontAvailable without public inventory fields', () => {
    expect(publicCatalogFixture[0]).toHaveProperty('storefrontAvailable');
    expect(collectKeys(publicCatalogFixture).some((key) => /inventory/i.test(key))).toBe(false);
  });

  it('keeps the static extraction replay outside the public-only catalog record', () => {
    expect(publicCatalogFixture[0]).not.toHaveProperty('extractionStatus');
    expect(productExtractionReplay.provenance).toBe('synthetic');
    expect(productExtractionReplay.status).toBe(
      'AI-assisted draft — human verification required',
    );
  });

  it('contains no forbidden sensitive fixture keys', () => {
    const forbiddenKeys = [
      'inventory_quantity',
      'old_inventory_quantity',
      'email',
      'address',
      'customerName',
      'accessToken',
      'password',
      'secret',
    ];

    const fixtureKeys = collectKeys(fixtureBundle);
    for (const forbiddenKey of forbiddenKeys) {
      expect(fixtureKeys).not.toContain(forbiddenKey);
    }
  });

  it('joins every scenario and queue signal to a public catalog product', () => {
    const catalogHandles = new Set(publicCatalogFixture.map(({ handle }) => handle));
    const referencedHandles = [
      ...syntheticOperationalScenarios.map(({ input }) => input.productHandle),
      productExtractionReplay.productHandle,
      syntheticQueueSignals.availabilityReview.productHandle,
      syntheticQueueSignals.blockedReview.input.productHandle,
    ];

    expect(referencedHandles.every((handle) => catalogHandles.has(handle))).toBe(true);
  });

  it('rejects invalid joins, negative values, non-fictional studios, and forbidden keys', () => {
    const invalidJoin = structuredClone(fixtureBundle);
    invalidJoin.operationalScenarios[0].input.productHandle = 'not-in-the-public-catalog';

    const negativeValue = structuredClone(fixtureBundle);
    negativeValue.operationalScenarios[0].input.averageDailyUnits = -1;

    const nonFictionalStudio = {
      ...structuredClone(fixtureBundle),
      studioScenarios: [
        {
          ...structuredClone(fixtureBundle.studioScenarios[0]),
          fictional: false,
        },
        ...structuredClone(fixtureBundle.studioScenarios.slice(1)),
      ],
    };

    const forbiddenField = structuredClone(fixtureBundle) as typeof fixtureBundle & {
      publicCatalog: Array<(typeof fixtureBundle.publicCatalog)[number] & { inventory_quantity?: number }>;
    };
    forbiddenField.publicCatalog[0].inventory_quantity = 42;

    expect(buddhaDemoFixtureSchema.safeParse(invalidJoin).success).toBe(false);
    expect(buddhaDemoFixtureSchema.safeParse(negativeValue).success).toBe(false);
    expect(buddhaDemoFixtureSchema.safeParse(nonFictionalStudio).success).toBe(false);
    expect(buddhaDemoFixtureSchema.safeParse(forbiddenField).success).toBe(false);
  });
});
