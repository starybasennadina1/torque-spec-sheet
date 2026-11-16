/**
 * Torque unit conversion. Canonical storage unit is Nm, kept unrounded.
 * Factors follow NIST SP 811 Appendix B.8/B.9.
 */
export type Unit = 'Nm' | 'lb-ft' | 'kgf-m';

export const UNITS: Unit[] = ['Nm', 'lb-ft', 'kgf-m'];

export const UNIT_TO_NM: Record<Unit, number> = {
  'Nm': 1,
  'lb-ft': 1.3558179483314004,
  'kgf-m': 9.80665,
};

export const UNIT_LONG: Record<Unit, string> = {
  'Nm': 'newton metre',
  'lb-ft': 'pound-force foot',
  'kgf-m': 'kilogram-force metre',
};

export const MAX_NM = 1000000;

export function toNm(value: number, unit: Unit): number {
  return value * UNIT_TO_NM[unit];
}

export function fromNm(nm: number, unit: Unit): number {
  return nm / UNIT_TO_NM[unit];
}

export function convert(value: number, from: Unit, to: Unit): number {
  return fromNm(toNm(value, from), to);
}

/** The two units that are not the given one, in the fixed catalog order. */
export function otherUnits(unit: Unit): Unit[] {
  return UNITS.filter(u => u !== unit);
}

/** Preferred output falls back to the next different unit in fixed order. */
export function resolveOutputUnit(input: Unit, preferred: Unit): Unit {
  if (preferred !== input) {
    return preferred;
  }
  const idx = UNITS.indexOf(input);
  return UNITS[(idx + 1) % UNITS.length];
}

export function isValidNumber(n: number): boolean {
  return Number.isFinite(n) && n >= 0 && n <= MAX_NM;
}

/**
 * Parses a user buffer. Accepts a comma as decimal separator, rejects signs,
 * exponents, thousands separators and multiple decimal marks.
 */
export function parseInputText(raw: string): number | null {
  const text = raw.trim().replace(',', '.');
  if (text.length === 0) {
    return null;
  }
  if (!/^\d*\.?\d*$/.test(text)) {
    return null;
  }
  if (text === '.' ) {
    return null;
  }
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

/** Presentation-only rounding. Never mutates the stored canonical value. */
export function formatTorque(nm: number, unit: Unit, decimals: number): string {
  const value = fromNm(nm, unit);
  if (!Number.isFinite(value)) {
    return '--';
  }
  const smallest = Math.pow(10, -decimals);
  if (value > 0 && value < smallest / 2) {
    return '< ' + smallest.toFixed(decimals);
  }
  return value.toFixed(decimals);
}

/** Compact stepper formatting of a value already expressed in `unit`. */
export function formatRaw(value: number, decimals: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const rounded = Math.round(value * 1e6) / 1e6;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return String(Number(rounded.toFixed(Math.max(decimals, 2))));
}

export function clampNm(nm: number): number {
  if (!Number.isFinite(nm)) {
    return 0;
  }
  return Math.min(MAX_NM, Math.max(0, nm));
}
