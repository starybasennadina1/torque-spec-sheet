import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_STEP,
  DEFAULT_VALUE,
  STEPPER_HOLD_DELAY_MS,
  STEPPER_REPEAT_MS,
} from '../constants/config';
import {
  clampNm,
  formatRaw,
  fromNm,
  isValidNumber,
  parseInputText,
  resolveOutputUnit,
  toNm,
  type Unit,
} from '../game/torqueConversion';
import type { ConversionSnapshot, SpecOrigin } from '../game/conversionSession';

export type ConverterDraft = {
  nm: number;
  inputUnit: Unit;
  outputUnit: Unit;
  step: number;
  text: string;
  isExample: boolean;
  origin: SpecOrigin;
  boltSize?: string;
  source?: string;
  conditions?: string;
};

function initialDraft(defaultInput: Unit, preferredOutput: Unit): ConverterDraft {
  return {
    nm: toNm(DEFAULT_VALUE, defaultInput),
    inputUnit: defaultInput,
    outputUnit: resolveOutputUnit(defaultInput, preferredOutput),
    step: DEFAULT_STEP,
    text: String(DEFAULT_VALUE),
    isExample: true,
    origin: 'custom',
  };
}

export function useConverter(defaultInput: Unit, preferredOutput: Unit) {
  const [draft, setDraft] = useState<ConverterDraft>(() =>
    initialDraft(defaultInput, preferredOutput),
  );

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRepeat = useCallback(() => {
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (repeatTimer.current !== null) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  useEffect(() => stopRepeat, [stopRepeat]);

  const parsed = useMemo(() => parseInputText(draft.text), [draft.text]);
  const valid = parsed !== null && isValidNumber(toNm(parsed, draft.inputUnit));

  const setText = useCallback((text: string) => {
    setDraft(prev => {
      const next = parseInputText(text);
      const nm = next === null ? prev.nm : clampNm(toNm(next, prev.inputUnit));
      return { ...prev, text, nm, isExample: false };
    });
  }, []);

  const bump = useCallback((direction: 1 | -1) => {
    setDraft(prev => {
      const current = fromNm(prev.nm, prev.inputUnit);
      const next = Math.max(0, Math.round((current + direction * prev.step) * 1e6) / 1e6);
      const nm = clampNm(toNm(next, prev.inputUnit));
      return { ...prev, nm, text: formatRaw(fromNm(nm, prev.inputUnit), 2), isExample: false };
    });
  }, []);

  const startRepeat = useCallback(
    (direction: 1 | -1) => {
      stopRepeat();
      bump(direction);
      holdTimer.current = setTimeout(() => {
        repeatTimer.current = setInterval(() => bump(direction), STEPPER_REPEAT_MS);
      }, STEPPER_HOLD_DELAY_MS);
    },
    [bump, stopRepeat],
  );

  const setInputUnit = useCallback((unit: Unit) => {
    setDraft(prev => {
      if (prev.inputUnit === unit) {
        return prev;
      }
      const outputUnit = resolveOutputUnit(unit, prev.outputUnit);
      return {
        ...prev,
        inputUnit: unit,
        outputUnit,
        text: formatRaw(fromNm(prev.nm, unit), 2),
      };
    });
  }, []);

  const setOutputUnit = useCallback((unit: Unit) => {
    setDraft(prev => ({ ...prev, outputUnit: resolveOutputUnit(prev.inputUnit, unit) }));
  }, []);

  const setStep = useCallback((step: number) => {
    setDraft(prev => ({ ...prev, step }));
  }, []);

  const swapUnits = useCallback(() => {
    setDraft(prev => {
      const nextInput = prev.outputUnit;
      const nextOutput = prev.inputUnit;
      return {
        ...prev,
        inputUnit: nextInput,
        outputUnit: nextOutput,
        text: formatRaw(fromNm(prev.nm, nextInput), 2),
      };
    });
  }, []);

  const reset = useCallback(() => {
    stopRepeat();
    setDraft(initialDraft(defaultInput, preferredOutput));
  }, [defaultInput, preferredOutput, stopRepeat]);

  const loadReference = useCallback(
    (nm: number, size: string, source: string, conditions: string, unit: Unit) => {
      setDraft(prev => ({
        ...prev,
        nm: clampNm(nm),
        inputUnit: unit,
        outputUnit: resolveOutputUnit(unit, prev.outputUnit),
        text: formatRaw(fromNm(nm, unit), 2),
        isExample: false,
        origin: 'reference',
        boltSize: size,
        source,
        conditions,
      }));
    },
    [],
  );

  const loadSpec = useCallback((nm: number, unit: Unit, origin: SpecOrigin) => {
    setDraft(prev => ({
      ...prev,
      nm: clampNm(nm),
      inputUnit: unit,
      outputUnit: resolveOutputUnit(unit, prev.outputUnit),
      text: formatRaw(fromNm(nm, unit), 2),
      isExample: false,
      origin,
    }));
  }, []);

  const snapshot = useCallback(
    (decimals: number): ConversionSnapshot => ({
      nm: draft.nm,
      inputUnit: draft.inputUnit,
      outputUnit: draft.outputUnit,
      decimals,
      origin: draft.origin,
      isExample: draft.isExample,
      boltSize: draft.boltSize,
      source: draft.source,
      conditions: draft.conditions,
    }),
    [draft],
  );

  return {
    draft,
    valid,
    setText,
    setInputUnit,
    setOutputUnit,
    setStep,
    swapUnits,
    startRepeat,
    stopRepeat,
    reset,
    loadReference,
    loadSpec,
    snapshot,
  };
}

export default useConverter;
