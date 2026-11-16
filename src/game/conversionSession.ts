import type { Unit } from './torqueConversion';

export type SpecOrigin = 'custom' | 'reference';

export type Vehicle = {
  id: string;
  name: string;
  type: 'bike' | 'car' | 'other';
  model?: string;
};

export type Spec = {
  id: string;
  name: string;
  nm: number;
  inputUnit: Unit;
  vehicleId: string | null;
  origin: SpecOrigin;
  boltSize?: string;
  source?: string;
  conditions?: string;
  updatedAt: number;
};

export type ConversionSnapshot = {
  nm: number;
  inputUnit: Unit;
  outputUnit: Unit;
  decimals: number;
  origin: SpecOrigin;
  isExample: boolean;
  boltSize?: string;
  source?: string;
  conditions?: string;
};

let seq = 0;
export function makeId(prefix: string): string {
  seq += 1;
  return prefix + '-' + Date.now().toString(36) + '-' + seq.toString(36);
}

export function vehicleLabel(vehicles: Vehicle[], id: string | null): string {
  if (id === null) {
    return 'Unassigned';
  }
  const found = vehicles.find(v => v.id === id);
  return found ? found.name : 'Unassigned';
}

export function countSpecsFor(specs: Spec[], vehicleId: string | null): number {
  return specs.filter(s => s.vehicleId === vehicleId).length;
}

export type SortMode = 'recent' | 'name' | 'torque';

export function sortSpecs(specs: Spec[], mode: SortMode): Spec[] {
  const copy = specs.slice();
  if (mode === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) || b.updatedAt - a.updatedAt);
  } else if (mode === 'torque') {
    copy.sort((a, b) => a.nm - b.nm || b.updatedAt - a.updatedAt);
  } else {
    copy.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return copy;
}

export function filterSpecs(specs: Spec[], query: string, vehicles: Vehicle[]): Spec[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return specs;
  }
  return specs.filter(s => {
    const label = vehicleLabel(vehicles, s.vehicleId).toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      label.includes(q) ||
      (s.boltSize ? s.boltSize.toLowerCase().includes(q) : false) ||
      (s.source ? s.source.toLowerCase().includes(q) : false)
    );
  });
}
