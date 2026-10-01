import { useCallback, useEffect, useMemo, useState } from 'react';
import { calcAll } from '../lib/calc';
import { DEFAULT_BUY, DEFAULT_COSTS, DEFAULT_SELL } from '../lib/defaults';
import { createSnapshot, defaultState, loadState, saveState } from '../lib/storage';
import type {
  FixedCosts,
  GradeKey,
  PriceMap,
  PriceSnapshot,
  StationBuyMap,
  StationId,
} from '../types';

export function useAppState() {
  const [state, setState] = useState(() =>
    typeof window !== 'undefined' ? loadState() : defaultState()
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const stressAmt = state.stressEnabled ? state.stressAmount : 0;

  const stations = useMemo(
    () => calcAll(state.sell, state.buy, state.costs, stressAmt),
    [state.sell, state.buy, state.costs, stressAmt]
  );

  const setSell = useCallback((key: GradeKey, value: number) => {
    setState((s) => ({
      ...s,
      sell: { ...s.sell, [key]: Math.max(0, value) },
    }));
  }, []);

  const setBuy = useCallback((station: StationId, key: GradeKey, value: number) => {
    setState((s) => ({
      ...s,
      buy: {
        ...s.buy,
        [station]: { ...s.buy[station], [key]: Math.max(0, value) },
      },
    }));
  }, []);

  const setCosts = useCallback((costs: FixedCosts) => {
    setState((s) => ({ ...s, costs }));
  }, []);

  const setStressEnabled = useCallback((enabled: boolean) => {
    setState((s) => ({ ...s, stressEnabled: enabled }));
  }, []);

  const setStressAmount = useCallback((amount: number) => {
    setState((s) => ({ ...s, stressAmount: Math.max(0, amount) }));
  }, []);

  const resetDefaults = useCallback(() => {
    setState((s) => ({
      ...s,
      sell: { ...DEFAULT_SELL },
      buy: {
        pps: { ...DEFAULT_BUY.pps },
        taytay: { ...DEFAULT_BUY.taytay },
        buliluya: { ...DEFAULT_BUY.buliluya },
      },
      costs: { ...DEFAULT_COSTS },
      stressEnabled: false,
      stressAmount: 300,
    }));
  }, []);

  const saveNamedSet = useCallback((name: string, note?: string) => {
    setState((s) => {
      const snap = createSnapshot(name, s.sell, s.buy, s.costs, note);
      return { ...s, history: [snap, ...s.history].slice(0, 50) };
    });
  }, []);

  const loadSnapshot = useCallback((snap: PriceSnapshot) => {
    setState((s) => ({
      ...s,
      sell: { ...snap.sell },
      buy: {
        pps: { ...snap.buy.pps },
        taytay: { ...snap.buy.taytay },
        buliluya: { ...snap.buy.buliluya },
      },
      costs: { ...snap.costs },
    }));
  }, []);

  const deleteSnapshot = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      history: s.history.filter((h) => h.id !== id),
    }));
  }, []);

  const applySellAll = useCallback((sell: PriceMap) => {
    setState((s) => ({ ...s, sell: { ...sell } }));
  }, []);

  const applyBuyAll = useCallback((buy: StationBuyMap) => {
    setState((s) => ({
      ...s,
      buy: {
        pps: { ...buy.pps },
        taytay: { ...buy.taytay },
        buliluya: { ...buy.buliluya },
      },
    }));
  }, []);

  return {
    state,
    stations,
    setSell,
    setBuy,
    setCosts,
    setStressEnabled,
    setStressAmount,
    resetDefaults,
    saveNamedSet,
    loadSnapshot,
    deleteSnapshot,
    applySellAll,
    applyBuyAll,
  };
}
