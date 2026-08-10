import { availabilityDiscrepancyInputSchema, decisionInputSchema } from './types';
import type {
  AvailabilityDiscrepancyInput,
  DecisionInput,
  DecisionResult,
  EvidenceItem,
} from './types';

function inputEvidence(label: string, value: string): EvidenceItem {
  return { label, value, provenance: 'synthetic' };
}

function assertNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative finite number`);
  }
}

export function calculateDaysOfCover(availableUnits: number, averageDailyUnits: number): number | null {
  assertNonNegativeFinite(availableUnits, 'availableUnits');
  assertNonNegativeFinite(averageDailyUnits, 'averageDailyUnits');

  return averageDailyUnits === 0 ? null : availableUnits / averageDailyUnits;
}

export function calculateLeadTimeDemand(
  averageDailyUnits: number,
  supplierLeadTimeDays: number,
): number {
  assertNonNegativeFinite(averageDailyUnits, 'averageDailyUnits');
  assertNonNegativeFinite(supplierLeadTimeDays, 'supplierLeadTimeDays');

  return averageDailyUnits * supplierLeadTimeDays;
}

export function buildReplenishmentDecision(rawInput: DecisionInput): DecisionResult {
  const input = decisionInputSchema.parse(rawInput);
  const blockingMissingFields = [
    ...(input.supplierLeadTimeDays === undefined ? ['supplierLeadTimeDays'] : []),
    ...(input.availableUnits === undefined ? ['availableUnits'] : []),
  ];

  if (blockingMissingFields.length > 0) {
    const missingLeadTime = blockingMissingFields.includes('supplierLeadTimeDays');
    const missingAvailability = blockingMissingFields.includes('availableUnits');
    const missingReason = [
      ...(missingLeadTime ? ['supplier lead time'] : []),
      ...(missingAvailability ? ['available units'] : []),
    ].join(' and ');

    return {
      id: `${input.productHandle}-blocked-replenishment`,
      priority: 'blocked',
      title: missingLeadTime
        ? 'Decision blocked: supplier or cost input missing'
        : 'Decision blocked: availability input missing',
      recommendation: `Confirm ${missingReason} before approving a replenishment action.`,
      reason: `${missingReason[0].toUpperCase()}${missingReason.slice(1)} ${
        blockingMissingFields.length === 1 ? 'is' : 'are'
      } missing, so coverage cannot be compared with replenishment timing.`,
      confidence: 'blocked',
      owner: 'Purchasing and inventory operations',
      nextAction: 'Confirm the missing operating inputs and verified unit cost, then rerun the decision.',
      evidence: [
        inputEvidence('Average daily units', `${input.averageDailyUnits}`),
        ...(input.availableUnits === undefined
          ? [{ label: 'Available units', value: 'Required before a recommendation', provenance: 'missing' as const }]
          : [inputEvidence('Available units', `${input.availableUnits}`)]),
        ...(input.supplierLeadTimeDays === undefined
          ? [
              {
                label: 'Supplier lead time',
                value: 'Required before a recommendation',
                provenance: 'missing' as const,
              },
            ]
          : [inputEvidence('Supplier lead time', `${input.supplierLeadTimeDays} days`)]),
        { label: 'Verified unit cost', value: 'Required for approval', provenance: 'missing' },
      ],
      missingFields: [...blockingMissingFields, 'verifiedUnitCost'],
    };
  }

  if (input.availableUnits === undefined || input.supplierLeadTimeDays === undefined) {
    throw new Error('Decision input invariant failed after blocking-field validation');
  }

  const daysOfCover = calculateDaysOfCover(input.availableUnits, input.averageDailyUnits);
  const safetyStockDays = input.safetyStockDays ?? 0;
  const reviewThresholdDays = input.supplierLeadTimeDays + safetyStockDays;

  if (daysOfCover !== null && daysOfCover < reviewThresholdDays) {
    return {
      id: `${input.productHandle}-replenishment`,
      priority: 'high',
      title: 'Review replenishment',
      recommendation: `Review replenishment: modeled coverage is ${(
        reviewThresholdDays - daysOfCover
      ).toFixed(1)} days below the ${reviewThresholdDays.toFixed(1)}-day planning threshold.`,
      reason: `${daysOfCover.toFixed(1)} days of coverage is shorter than the ${reviewThresholdDays.toFixed(1)}-day supplier lead-time and safety-stock threshold.`,
      confidence: 'medium',
      owner: 'Purchasing and operations',
      nextAction: 'Confirm inbound timing and approve, adjust, or decline the proposed replenishment review.',
      evidence: [
        inputEvidence('Average daily units', `${input.averageDailyUnits}`),
        inputEvidence('Available units', `${input.availableUnits}`),
        inputEvidence('Supplier lead time', `${input.supplierLeadTimeDays} days`),
        ...(input.safetyStockDays === undefined
          ? [{ label: 'Safety-stock target', value: 'Not provided', provenance: 'missing' as const }]
          : [inputEvidence('Safety-stock target', `${input.safetyStockDays} days`)]),
        ...(input.openPurchaseOrderUnits === undefined
          ? [{ label: 'Open purchase-order units', value: 'Not provided', provenance: 'missing' as const }]
          : [
              inputEvidence(
                'Open purchase-order units (not counted without a confirmed ETA)',
                `${input.openPurchaseOrderUnits}`,
              ),
            ]),
        { label: 'Calculated days of cover', value: `${daysOfCover.toFixed(1)} days`, provenance: 'derived' },
        {
          label: 'Lead-time demand',
          value: `${calculateLeadTimeDemand(input.averageDailyUnits, input.supplierLeadTimeDays).toFixed(1)} units`,
          provenance: 'derived',
        },
        {
          label: 'Review rule',
          value: 'Flag when days of cover is shorter than supplier lead time plus safety-stock days',
          provenance: 'derived',
        },
      ],
      missingFields: [
        ...(input.safetyStockDays === undefined ? ['safetyStockDays'] : []),
        ...(input.openPurchaseOrderUnits === undefined ? ['openPurchaseOrderUnits'] : []),
        ...(input.openPurchaseOrderUnits && input.openPurchaseOrderUnits > 0
          ? ['purchaseOrderEta']
          : []),
        'supplierMinimumOrderQuantity',
      ],
    };
  }

  if (daysOfCover === null) {
    return {
      id: `${input.productHandle}-replenishment`,
      priority: 'low',
      title: 'Review replenishment',
      recommendation: 'Validate the demand signal before creating replenishment urgency.',
      reason: 'Average daily demand is at zero velocity in this scenario, so days of cover is not calculated.',
      confidence: 'low',
      owner: 'Demand planning',
      nextAction: 'Confirm the demand-history window and whether zero velocity is representative.',
      evidence: [
        inputEvidence('Average daily units', '0'),
        inputEvidence('Available units', `${input.availableUnits}`),
        inputEvidence('Supplier lead time', `${input.supplierLeadTimeDays} days`),
        {
          label: 'Calculated days of cover',
          value: 'Not calculated at zero velocity',
          provenance: 'derived',
        },
      ],
      missingFields: ['validatedDemandHistory'],
    };
  }

  return {
    id: `${input.productHandle}-replenishment`,
    priority: 'low',
    title: 'Review replenishment',
    recommendation: 'No immediate replenishment signal; keep this item in the next planning review.',
    reason: `${daysOfCover.toFixed(1)} days of coverage meets or exceeds the ${reviewThresholdDays.toFixed(1)}-day supplier lead-time and safety-stock threshold.`,
    confidence: 'medium',
    owner: 'Operations',
    nextAction: 'Validate open purchase orders and review again on the next planning cadence.',
    evidence: [
      inputEvidence('Average daily units', `${input.averageDailyUnits}`),
      inputEvidence('Available units', `${input.availableUnits}`),
      inputEvidence('Supplier lead time', `${input.supplierLeadTimeDays} days`),
      ...(input.safetyStockDays === undefined
        ? [{ label: 'Safety-stock target', value: 'Not provided', provenance: 'missing' as const }]
        : [inputEvidence('Safety-stock target', `${input.safetyStockDays} days`)]),
      ...(input.openPurchaseOrderUnits === undefined
        ? [{ label: 'Open purchase-order units', value: 'Not provided', provenance: 'missing' as const }]
        : [
            inputEvidence(
              'Open purchase-order units (not counted without a confirmed ETA)',
              `${input.openPurchaseOrderUnits}`,
            ),
          ]),
      { label: 'Calculated days of cover', value: `${daysOfCover.toFixed(1)} days`, provenance: 'derived' },
      {
        label: 'Lead-time demand',
        value: `${calculateLeadTimeDemand(input.averageDailyUnits, input.supplierLeadTimeDays).toFixed(1)} units`,
        provenance: 'derived',
      },
      {
        label: 'Review rule',
        value: 'Flag when days of cover is shorter than supplier lead time plus safety-stock days',
        provenance: 'derived',
      },
    ],
    missingFields: [
      ...(input.safetyStockDays === undefined ? ['safetyStockDays'] : []),
      ...(input.openPurchaseOrderUnits === undefined ? ['openPurchaseOrderUnits'] : []),
      ...(input.openPurchaseOrderUnits && input.openPurchaseOrderUnits > 0 ? ['purchaseOrderEta'] : []),
      'supplierMinimumOrderQuantity',
    ],
  };
}

const decisionPriorityOrder: Record<DecisionResult['priority'], number> = {
  high: 0,
  blocked: 1,
  medium: 2,
  low: 3,
};

export function buildDecisionDesk(inputs: readonly DecisionInput[]): DecisionResult[] {
  // Preserve fixture order within each priority so equal-impact reviews remain predictable.
  return inputs
    .map((input, index) => ({ decision: buildReplenishmentDecision(input), index }))
    .sort(
      (left, right) =>
        decisionPriorityOrder[left.decision.priority] - decisionPriorityOrder[right.decision.priority] ||
        left.index - right.index,
    )
    .map(({ decision }) => decision);
}

export function buildAvailabilityDiscrepancyDecision(
  rawInput: AvailabilityDiscrepancyInput,
): DecisionResult {
  const input = availabilityDiscrepancyInputSchema.parse(rawInput);
  const signalsConflict =
    input.storefrontAvailable !== input.scenarioAvailableForAllocation;

  return {
    id: `${input.productHandle}-availability-review`,
    priority: signalsConflict ? 'high' : 'low',
    title: 'Review a product/availability discrepancy',
    recommendation: signalsConflict
      ? 'Reconcile the public purchase signal with the generated allocation scenario before taking action.'
      : 'No discrepancy is modeled; keep both signals on the normal review cadence.',
    reason: signalsConflict
      ? 'The public storefront and the generated operating scenario point to different availability states.'
      : 'The public storefront and generated operating scenario currently point to the same availability state.',
    confidence: signalsConflict ? 'medium' : 'low',
    owner: 'Commerce and inventory operations',
    nextAction:
      'Confirm location-level availability and channel allocation rules with the responsible human owner.',
    evidence: [
      {
        label: 'Public storefront signal',
        value: input.storefrontAvailable ? 'Available to purchase' : 'Not available to purchase',
        provenance: 'public',
        source: input.source,
      },
      {
        label: 'Generated allocation scenario',
        value: input.scenarioAvailableForAllocation
          ? 'Available for allocation'
          : 'Not available for allocation',
        provenance: 'synthetic',
      },
      {
        label: 'Comparison rule',
        value: 'Ask for human review when the public purchase signal differs from the operating scenario',
        provenance: 'derived',
      },
      {
        label: 'Location-level availability',
        value: 'Required to resolve the discrepancy',
        provenance: 'missing',
      },
    ],
    missingFields: ['locationAvailability', 'channelAllocationRules'],
  };
}
