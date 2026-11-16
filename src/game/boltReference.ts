import type { Unit } from './torqueConversion';

export type BoltReference = {
  id: string;
  size: string;
  nm: number;
};

/**
 * Steel class 8.8 tightening torques, Beckhoff Automation "Steel tightening
 * torques", checked 2026-11-13. Calculated with thread/contact friction 0.10,
 * 90% elastic-limit utilisation, VDI 2230 (February 2003).
 */
export const REFERENCE_CONDITIONS =
  'Steel class 8.8, friction 0.10, 90% elastic-limit utilisation, VDI 2230 (02/2003).';

export const REFERENCE_SOURCE = 'Beckhoff Automation, Steel tightening torques (checked 2026-11-13)';

export const BOLT_REFERENCE: BoltReference[] = [
  { id: 'm3', size: 'M3', nm: 1.15 },
  { id: 'm4', size: 'M4', nm: 2.64 },
  { id: 'm5', size: 'M5', nm: 5.2 },
  { id: 'm6', size: 'M6', nm: 9 },
  { id: 'm8', size: 'M8', nm: 21.5 },
  { id: 'm10', size: 'M10', nm: 42.5 },
  { id: 'm12', size: 'M12', nm: 73.5 },
  { id: 'm14', size: 'M14', nm: 118 },
  { id: 'm16', size: 'M16', nm: 180 },
];

export function searchReference(query: string): BoltReference[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return BOLT_REFERENCE;
  }
  return BOLT_REFERENCE.filter(row => row.size.toLowerCase().includes(q));
}

export type ReferenceDraft = {
  nm: number;
  unit: Unit;
  size: string;
};
