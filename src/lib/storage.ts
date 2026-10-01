import {
  DEFAULT_BUY,
  DEFAULT_COSTS,
  DEFAULT_SELL,
  STORAGE_KEY,
} from './defaults';
import type { AppState, FixedCosts, PriceMap, PriceSnapshot, StationBuyMap } from '../types';

function mergePriceMap(base: PriceMap, partial?: Partial<PriceMap>): PriceMap {
  return { ...base, ...(partial ?? {}) };
}

function mergeBuy(partial?: Partial<StationBuyMap>): StationBuyMap {
  return {
    pps: mergePriceMap(DEFAULT_BUY.pps, partial?.pps),
    taytay: mergePriceMap(DEFAULT_BUY.taytay, partial?.taytay),
    buliluya: mergePriceMap(DEFAULT_BUY.buliluya, partial?.buliluya),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      sell: mergePriceMap(DEFAULT_SELL, parsed.sell),
      buy: mergeBuy(parsed.buy),
      costs: { ...DEFAULT_COSTS, ...(parsed.costs ?? {}) },
      stressEnabled: Boolean(parsed.stressEnabled),
      stressAmount: typeof parsed.stressAmount === 'number' ? parsed.stressAmount : 300,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return defaultState();
  }
}

export function defaultState(): AppState {
  return {
    sell: { ...DEFAULT_SELL },
    buy: {
      pps: { ...DEFAULT_BUY.pps },
      taytay: { ...DEFAULT_BUY.taytay },
      buliluya: { ...DEFAULT_BUY.buliluya },
    },
    costs: { ...DEFAULT_COSTS },
    stressEnabled: false,
    stressAmount: 300,
    history: [],
  };
}

export function saveState(state: AppState): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      sell: state.sell,
      buy: state.buy,
      costs: state.costs,
      stressEnabled: state.stressEnabled,
      stressAmount: state.stressAmount,
      history: state.history,
    })
  );
}

export function createSnapshot(
  name: string,
  sell: PriceMap,
  buy: StationBuyMap,
  costs: FixedCosts,
  note?: string
): PriceSnapshot {
  return {
    id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    createdAt: new Date().toISOString(),
    sell: { ...sell },
    buy: {
      pps: { ...buy.pps },
      taytay: { ...buy.taytay },
      buliluya: { ...buy.buliluya },
    },
    costs: { ...costs },
    note,
  };
}
