import { z } from 'zod';

export const provenanceKinds = ['public', 'synthetic', 'derived', 'missing'] as const;
export const provenanceKindSchema = z.enum(provenanceKinds);
export type ProvenanceKind = (typeof provenanceKinds)[number];

export interface SourceReference {
  label: string;
  url: string;
  observedAt: string;
  provenance: 'public';
}

export interface EvidenceItem {
  label: string;
  value: string;
  provenance: ProvenanceKind;
  source?: SourceReference;
}

export interface DecisionInput {
  productHandle: string;
  averageDailyUnits: number;
  availableUnits?: number;
  openPurchaseOrderUnits?: number;
  supplierLeadTimeDays?: number;
  safetyStockDays?: number;
}

export interface DecisionResult {
  id: string;
  priority: 'high' | 'medium' | 'low' | 'blocked';
  title: string;
  recommendation: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low' | 'blocked';
  owner: string;
  nextAction: string;
  evidence: EvidenceItem[];
  missingFields: string[];
}

export interface AvailabilityDiscrepancyInput {
  productHandle: string;
  storefrontAvailable: boolean;
  scenarioAvailableForAllocation: boolean;
  source: SourceReference;
}

const nonEmptyStringSchema = z.string().trim().min(1);
const nonNegativeFiniteNumberSchema = z.number().finite().nonnegative();

export const sourceReferenceSchema: z.ZodType<SourceReference> = z.strictObject({
  label: nonEmptyStringSchema,
  url: z.string().trim().url().refine((url) => url.startsWith('https://'), {
    message: 'Public source URLs must use HTTPS',
  }),
  observedAt: z.string().datetime({ offset: true }),
  provenance: z.literal('public'),
});

export const evidenceItemSchema: z.ZodType<EvidenceItem> = z
  .strictObject({
    label: nonEmptyStringSchema,
    value: nonEmptyStringSchema,
    provenance: provenanceKindSchema,
    source: sourceReferenceSchema.optional(),
  })
  .superRefine((item, context) => {
    if (item.provenance === 'public' && item.source === undefined) {
      context.addIssue({
        code: 'custom',
        message: 'Public evidence must include an HTTPS source and observed timestamp',
        path: ['source'],
      });
    }
  });

export const decisionInputSchema: z.ZodType<DecisionInput> = z.strictObject({
  productHandle: nonEmptyStringSchema,
  averageDailyUnits: nonNegativeFiniteNumberSchema,
  availableUnits: nonNegativeFiniteNumberSchema.optional(),
  openPurchaseOrderUnits: nonNegativeFiniteNumberSchema.optional(),
  supplierLeadTimeDays: nonNegativeFiniteNumberSchema.optional(),
  safetyStockDays: nonNegativeFiniteNumberSchema.optional(),
});

export const decisionResultSchema: z.ZodType<DecisionResult> = z.strictObject({
  id: nonEmptyStringSchema,
  priority: z.enum(['high', 'medium', 'low', 'blocked']),
  title: nonEmptyStringSchema,
  recommendation: nonEmptyStringSchema,
  reason: nonEmptyStringSchema,
  confidence: z.enum(['high', 'medium', 'low', 'blocked']),
  owner: nonEmptyStringSchema,
  nextAction: nonEmptyStringSchema,
  evidence: z.array(evidenceItemSchema),
  missingFields: z.array(nonEmptyStringSchema),
});

export const availabilityDiscrepancyInputSchema: z.ZodType<AvailabilityDiscrepancyInput> =
  z.strictObject({
    productHandle: nonEmptyStringSchema,
    storefrontAvailable: z.boolean(),
    scenarioAvailableForAllocation: z.boolean(),
    source: sourceReferenceSchema,
  });
