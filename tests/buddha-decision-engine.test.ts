import { describe, expect, it } from 'vitest';

import {
  buildDecisionDesk,
  buildAvailabilityDiscrepancyDecision,
  buildReplenishmentDecision,
  calculateDaysOfCover,
  calculateLeadTimeDemand,
} from '../src/lib/buddha/decision-engine';
import { syntheticOperationalScenarios } from '../src/data/buddha-demo';

describe('deterministic planning metrics', () => {
  it('returns null cover at zero velocity instead of Infinity', () => {
    expect(calculateDaysOfCover(12, 0)).toBeNull();
    expect(calculateDaysOfCover(12, 1.5)).toBe(8);
  });

  it('calculates demand across the supplier lead time', () => {
    expect(calculateLeadTimeDemand(1.5, 14)).toBe(21);
  });
});

describe('buildReplenishmentDecision', () => {
  it('blocks the recommendation when supplier lead time is missing', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 12,
    });

    expect(result.priority).toBe('blocked');
    expect(result.missingFields).toContain('supplierLeadTimeDays');
    expect(result.reason).toMatch(/lead time/i);
  });

  it('blocks the recommendation when available units are missing', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      supplierLeadTimeDays: 14,
    });

    expect(result.priority).toBe('blocked');
    expect(result.title).toBe('Decision blocked: availability input missing');
    expect(result.missingFields).toContain('availableUnits');
    expect(result.reason).toMatch(/available units/i);
  });

  it('treats zero available units as a value rather than missing data', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 0,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });

    expect(result.priority).toBe('high');
    expect(result.missingFields).not.toContain('availableUnits');
  });

  it('creates a high-priority review when coverage is shorter than lead time plus safety stock', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 10,
      openPurchaseOrderUnits: 0,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });

    expect(result.priority).toBe('high');
    expect(result.title).toBe('Review replenishment');
    expect(result.reason).toMatch(/coverage/i);
  });

  it('does not create high urgency when coverage meets the planning threshold', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 21,
      openPurchaseOrderUnits: 0,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });

    expect(result.priority).not.toBe('high');
    expect(result.title).toBe('Review replenishment');
    expect(result.reason).toMatch(/coverage/i);
  });

  it('does not manufacture urgency or non-finite evidence at zero velocity', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 0,
      availableUnits: 10,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });

    expect(result.priority).toBe('low');
    expect(result.reason).toMatch(/zero velocity/i);
    expect(JSON.stringify(result)).not.toMatch(/Infinity|NaN/);
  });

  it('distinguishes supplied scenario inputs from calculated evidence', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 10,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });

    expect(result.evidence.some((item) => item.provenance === 'synthetic')).toBe(true);
    expect(result.evidence.some((item) => item.provenance === 'derived')).toBe(true);
  });

  it('keeps useful missing inputs visible without blocking a calculable review', () => {
    const result = buildReplenishmentDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 20,
      supplierLeadTimeDays: 14,
    });

    expect(result.priority).not.toBe('blocked');
    expect(result.confidence).toBe('medium');
    expect(result.missingFields).toEqual(
      expect.arrayContaining(['safetyStockDays', 'openPurchaseOrderUnits']),
    );
    expect(result.evidence).toContainEqual(
      expect.objectContaining({ label: 'Safety-stock target', provenance: 'missing' }),
    );
  });

  it('does not mutate its input', () => {
    const input = Object.freeze({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      averageDailyUnits: 1,
      availableUnits: 10,
      supplierLeadTimeDays: 14,
      safetyStockDays: 7,
    });
    const before = JSON.stringify(input);

    buildReplenishmentDecision(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  it('gives actionable and blocked reviews unique IDs for the same product', () => {
    const actionable = buildReplenishmentDecision({
      productHandle: 'same-product',
      averageDailyUnits: 1,
      availableUnits: 10,
      supplierLeadTimeDays: 14,
    });
    const blocked = buildReplenishmentDecision({
      productHandle: 'same-product',
      averageDailyUnits: 1,
      availableUnits: 10,
    });

    expect(actionable.id).not.toBe(blocked.id);
  });
});

describe('buildDecisionDesk', () => {
  it('stably ranks high-impact and blocked reviews before lower-priority items', () => {
    const inputs = [
      {
        productHandle: 'lower-priority',
        averageDailyUnits: 1,
        availableUnits: 30,
        openPurchaseOrderUnits: 0,
        supplierLeadTimeDays: 10,
        safetyStockDays: 5,
      },
      {
        productHandle: 'missing-lead-time',
        averageDailyUnits: 1,
        availableUnits: 10,
      },
      {
        productHandle: 'high-impact-first',
        averageDailyUnits: 1,
        availableUnits: 5,
        supplierLeadTimeDays: 10,
      },
      {
        productHandle: 'high-impact-second',
        averageDailyUnits: 1,
        availableUnits: 6,
        supplierLeadTimeDays: 10,
      },
    ];
    const before = structuredClone(inputs);
    const results = buildDecisionDesk(inputs);

    expect(results.map((result) => result.id)).toEqual([
      'high-impact-first-replenishment',
      'high-impact-second-replenishment',
      'missing-lead-time-blocked-replenishment',
      'lower-priority-replenishment',
    ]);
    expect(inputs).toEqual(before);
  });
});

describe('buildAvailabilityDiscrepancyDecision', () => {
  it('flags conflicting public and generated availability signals for human review', () => {
    const result = buildAvailabilityDiscrepancyDecision({
      productHandle: 'anais-clicker-with-blue-sapphire-lab-grown',
      storefrontAvailable: true,
      scenarioAvailableForAllocation: false,
      source: {
        label: 'Buddha Jewelry public product record',
        url: 'https://www.buddhajewelry.com/products/anais-clicker-with-blue-sapphire-lab-grown.json',
        observedAt: '2026-08-02T00:00:00.000Z',
        provenance: 'public',
      },
    });

    expect(result.priority).toBe('high');
    expect(result.title).toBe('Review a product/availability discrepancy');
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provenance: 'public' }),
        expect.objectContaining({ provenance: 'synthetic' }),
      ]),
    );
    expect(result.missingFields).toContain('locationAvailability');
  });
});

describe('predeclared planning scenarios', () => {
  it('produces an explainably different recommendation for each controlled input change', () => {
    const decisions = syntheticOperationalScenarios.map(({ input }) =>
      buildReplenishmentDecision(input),
    );

    expect(decisions.every(({ priority }) => priority === 'high')).toBe(true);
    expect(decisions.every(({ confidence }) => confidence === 'medium')).toBe(true);
    expect(
      decisions.every(({ missingFields }) =>
        missingFields.includes('supplierMinimumOrderQuantity'),
      ),
    ).toBe(true);
    expect(new Set(decisions.map(({ recommendation }) => recommendation)).size).toBe(3);
  });
});
