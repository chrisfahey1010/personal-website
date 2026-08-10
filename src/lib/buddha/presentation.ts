import type { DecisionResult, ProvenanceKind } from './types';

export const provenanceLabels: Record<ProvenanceKind, string> = {
  public: 'PUBLIC',
  synthetic: 'SYNTHETIC DEMO',
  derived: 'DERIVED',
  missing: 'MISSING',
};

export const decisionPriorityLabels: Record<DecisionResult['priority'], string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
  blocked: 'Blocked',
};

export const decisionConfidenceLabels: Record<DecisionResult['confidence'], string> = {
  high: 'High readiness',
  medium: 'Medium readiness',
  low: 'Low readiness',
  blocked: 'Blocked by missing data',
};

const missingFieldLabels: Record<string, string> = {
  supplierLeadTimeDays: 'Supplier lead time',
  availableUnits: 'Available units by location',
  verifiedUnitCost: 'Verified unit cost',
  safetyStockDays: 'Safety-stock target',
  openPurchaseOrderUnits: 'Open purchase-order quantity',
  purchaseOrderEta: 'Purchase-order ETA',
  supplierMinimumOrderQuantity: 'Supplier minimum order quantity',
  validatedDemandHistory: 'Validated demand-history window',
  locationAvailability: 'Location-level availability',
  channelAllocationRules: 'Channel allocation rules',
};

export function formatMissingField(field: string): string {
  return (
    missingFieldLabels[field] ??
    field
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .replace(/^./, (character) => character.toUpperCase())
  );
}
