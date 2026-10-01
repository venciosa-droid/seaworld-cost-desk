import { FOCUS_GRADE_KEYS, GRADES } from './defaults';
import type {
  FeeBreakdown,
  FixedCosts,
  GradeCalc,
  GradeKey,
  PriceMap,
  StationBuyMap,
  StationCalc,
  StationId,
} from '../types';
import { STATION_NAMES } from '../types';

function gradeByKey(key: GradeKey) {
  const g = GRADES.find((x) => x.key === key);
  if (!g) throw new Error(`Unknown grade: ${key}`);
  return g;
}

/** Per-fish fee components derived from fixed costs + pcs */
export function computeFees(
  stationId: StationId,
  pcs: number,
  costs: FixedCosts
): FeeBreakdown {
  const bfarPaper = costs.bfarPaperPer40 / 40;
  const bfarAux = costs.bfarAuxPer100Boxes / 100 / pcs; // 100/box → /pcs per fish
  const pcsdInspection = costs.pcsdInspectionPer40 / 40;
  const pcsdPerFish = costs.pcsdPerFish;
  const airCargo = costs.airCargoPerBox / pcs;

  let truckOrStation = 0;
  let truckLabel = '';
  let truckNote = '';

  if (stationId === 'pps') {
    truckOrStation =
      costs.ppsStationRun + costs.ppsManilaPickup + costs.ppsExtra;
    truckLabel = 'PPS station + pickup + extra';
    truckNote = `${costs.ppsStationRun} + ${costs.ppsManilaPickup} + ${costs.ppsExtra}`;
  } else if (stationId === 'taytay') {
    truckOrStation = costs.taytayTruckTotal / costs.taytayTruckFish;
    truckLabel = 'Taytay truck / fish';
    truckNote = `${costs.taytayTruckTotal} / ${costs.taytayTruckFish}`;
  } else {
    truckOrStation = costs.buliluyaTruckTotal / costs.buliluyaTruckFish;
    truckLabel = 'Buliluya truck / fish';
    truckNote = `${costs.buliluyaTruckTotal} / ${costs.buliluyaTruckFish}`;
  }

  const total =
    bfarPaper + bfarAux + pcsdInspection + pcsdPerFish + airCargo + truckOrStation;

  const labels = [
    { name: 'BFAR paper', value: bfarPaper, note: `${costs.bfarPaperPer40} / 40` },
    { name: 'BFAR aux', value: bfarAux, note: `${costs.bfarAuxPer100Boxes / 100}/box ÷ ${pcs} pcs` },
    { name: 'PCSD inspection', value: pcsdInspection, note: `${costs.pcsdInspectionPer40} / 40` },
    { name: 'PCSD per fish', value: pcsdPerFish },
    { name: 'Air cargo', value: airCargo, note: `${costs.airCargoPerBox}/box ÷ ${pcs} pcs` },
    { name: truckLabel, value: truckOrStation, note: truckNote },
  ];

  return {
    bfarPaper,
    bfarAux,
    pcsdInspection,
    pcsdPerFish,
    airCargo,
    truckOrStation,
    total,
    labels,
  };
}

export function calcGrade(
  gradeKey: GradeKey,
  stationId: StationId,
  sell: PriceMap,
  buy: StationBuyMap,
  costs: FixedCosts,
  stressAmount: number
): GradeCalc {
  const def = gradeByKey(gradeKey);
  const sellPrice = sell[gradeKey];
  const buyPrice = buy[stationId][gradeKey];
  const fees = computeFees(stationId, def.pcs, costs);
  const directCost = fees.total;
  const netFish = sellPrice - buyPrice - fees.total;
  const margin = sellPrice > 0 ? netFish / sellPrice : 0;
  const netBox = netFish * def.pcs;

  const stressSell = Math.max(0, sellPrice - stressAmount);
  const stressNetFish = stressSell - buyPrice - fees.total;
  const stressMargin = stressSell > 0 ? stressNetFish / stressSell : 0;
  const stressNetBox = stressNetFish * def.pcs;

  return {
    grade: gradeKey,
    label: def.label,
    shortLabel: def.shortLabel,
    color: def.color,
    pcs: def.pcs,
    sizeLabel: def.sizeLabel,
    sell: sellPrice,
    buy: buyPrice,
    fees,
    directCost,
    netFish,
    margin,
    netBox,
    stressNetFish,
    stressMargin,
    stressNetBox,
    isLoss: netFish < 0,
    isFocus: FOCUS_GRADE_KEYS.includes(gradeKey),
  };
}

export function calcStation(
  stationId: StationId,
  sell: PriceMap,
  buy: StationBuyMap,
  costs: FixedCosts,
  stressAmount: number
): StationCalc {
  const grades = GRADES.map((g) =>
    calcGrade(g.key, stationId, sell, buy, costs, stressAmount)
  );

  const focus = grades.filter((g) => g.isFocus);
  const focusMargin =
    focus.length > 0
      ? focus.reduce((s, g) => s + g.margin, 0) / focus.length
      : 0;
  const stressFocusMargin =
    focus.length > 0
      ? focus.reduce((s, g) => s + g.stressMargin, 0) / focus.length
      : 0;

  const lossCount = grades.filter((g) => g.isLoss).length;

  let best = grades[0];
  let worst = grades[0];
  for (const g of grades) {
    if (g.netBox > best.netBox) best = g;
    if (g.netBox < worst.netBox) worst = g;
  }

  return {
    stationId,
    name: STATION_NAMES[stationId],
    grades,
    focusMargin,
    stressFocusMargin,
    lossCount,
    bestNetBox: { grade: best.shortLabel, value: best.netBox },
    worstNetBox: { grade: worst.shortLabel, value: worst.netBox },
  };
}

export function calcAll(
  sell: PriceMap,
  buy: StationBuyMap,
  costs: FixedCosts,
  stressAmount: number
): StationCalc[] {
  const stations: StationId[] = ['pps', 'taytay', 'buliluya'];
  return stations.map((id) => calcStation(id, sell, buy, costs, stressAmount));
}

export function formatPeso(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}₱${Math.abs(n).toFixed(2)}`;
}

export function formatPct(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

export function marginClass(margin: number): string {
  const p = margin * 100;
  if (p >= 20) return 'm-dark-green';
  if (p >= 15) return 'm-green';
  if (p >= 10) return 'm-light-green';
  if (p >= 5) return 'm-yellow';
  if (p >= 0) return 'm-orange';
  return 'm-red';
}

export function netClass(n: number): string {
  return n >= 0 ? 'net-pos' : 'net-neg';
}

export function clampPrice(n: number): number {
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}
