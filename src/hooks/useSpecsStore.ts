import { useCallback, useMemo, useState } from 'react';
import {
  countSpecsFor,
  makeId,
  type Spec,
  type Vehicle,
} from '../game/conversionSession';

/**
 * Session store for saved specs and vehicle folders.
 * Mutations are atomic per call: removing a folder and reassigning its specs
 * land in the same update, so a spec can never point at a missing folder.
 */
export function useSpecsStore() {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const saveSpec = useCallback(
    (draft: Omit<Spec, 'id' | 'updatedAt'> & { id?: string }) => {
      const id = draft.id ?? makeId('spec');
      const record: Spec = { ...draft, id, updatedAt: Date.now() };
      setSpecs(prev => {
        const index = prev.findIndex(s => s.id === id);
        if (index === -1) {
          return [record].concat(prev);
        }
        const next = prev.slice();
        next[index] = record;
        return next;
      });
      return id;
    },
    [],
  );

  const deleteSpec = useCallback((id: string) => {
    setSpecs(prev => prev.filter(s => s.id !== id));
  }, []);

  const addVehicle = useCallback((name: string, type: Vehicle['type'], model?: string) => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const id = makeId('veh');
    setVehicles(prev => {
      const exists = prev.some(v => v.name.toLowerCase() === trimmed.toLowerCase());
      if (exists) {
        return prev;
      }
      return prev
        .concat({ id, name: trimmed, type, model })
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    });
    return id;
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setSpecs(prev => prev.map(s => (s.vehicleId === id ? { ...s, vehicleId: null } : s)));
  }, []);

  const clearAll = useCallback(() => {
    setSpecs([]);
    setVehicles([]);
  }, []);

  const counts = useMemo(
    () => ({
      specs: specs.length,
      vehicles: vehicles.length,
      unassigned: countSpecsFor(specs, null),
    }),
    [specs, vehicles],
  );

  return {
    specs,
    vehicles,
    counts,
    saveSpec,
    deleteSpec,
    addVehicle,
    deleteVehicle,
    clearAll,
  };
}

export default useSpecsStore;
