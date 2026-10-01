import type { FixedCosts, GradeDef, GradeKey, PriceMap, StationBuyMap } from '../types';

export const GRADES: GradeDef[] = [
  { key: 'xo', label: 'Red XOs', shortLabel: 'XOs', color: 'red', pcs: 2, sizeLabel: '2.2kg up' },
  { key: 'o', label: 'Red Os', shortLabel: 'Os', color: 'red', pcs: 2, sizeLabel: '1.36–2.19kg' },
  { key: 's', label: 'Red Ss', shortLabel: 'Ss', color: 'red', pcs: 4, sizeLabel: '0.9–1.35kg' },
  { key: 'g', label: 'Red Gs', shortLabel: 'Gs', color: 'red', pcs: 6, sizeLabel: '0.5–0.89kg' },
  { key: 'u', label: 'Red Us', shortLabel: 'Us', color: 'red', pcs: 8, sizeLabel: '0.3–0.49kg' },
  { key: 'brown_xo', label: 'Brown XOs', shortLabel: 'BXOs', color: 'brown', pcs: 2, sizeLabel: '2.2kg up' },
  { key: 'brown_o', label: 'Brown Os', shortLabel: 'BOs', color: 'brown', pcs: 2, sizeLabel: '1.36–2.19kg' },
  { key: 'brown_s', label: 'Brown Ss', shortLabel: 'BSs', color: 'brown', pcs: 4, sizeLabel: '0.9–1.35kg' },
  { key: 'brown_g', label: 'Brown Gs', shortLabel: 'BGs', color: 'brown', pcs: 6, sizeLabel: '0.5–0.89kg' },
  { key: 'brown_u', label: 'Brown Us', shortLabel: 'BUs', color: 'brown', pcs: 8, sizeLabel: '0.3–0.49kg' },
];

export const GRADE_KEYS = GRADES.map((g) => g.key);

export const DEFAULT_SELL: PriceMap = {
  xo: 3700,
  o: 2600,
  s: 2300,
  g: 1700,
  u: 1100,
  brown_xo: 1400,
  brown_o: 1300,
  brown_s: 1000,
  brown_g: 1000,
  brown_u: 500,
};

export const DEFAULT_BUY: StationBuyMap = {
  pps: {
    xo: 1800,
    o: 1800,
    s: 1800,
    g: 1200,
    u: 300,
    brown_xo: 500,
    brown_o: 500,
    brown_s: 500,
    brown_g: 500,
    brown_u: 100,
  },
  taytay: {
    xo: 1800,
    o: 1800,
    s: 1700,
    g: 1200,
    u: 300,
    brown_xo: 500,
    brown_o: 500,
    brown_s: 500,
    brown_g: 500,
    brown_u: 100,
  },
  buliluya: {
    xo: 1800,
    o: 1800,
    s: 1700,
    g: 1200,
    u: 300,
    brown_xo: 500,
    brown_o: 500,
    brown_s: 500,
    brown_g: 500,
    brown_u: 100,
  },
};

export const DEFAULT_COSTS: FixedCosts = {
  bfarPaperPer40: 100,
  bfarAuxPer100Boxes: 10000,
  pcsdInspectionPer40: 210,
  pcsdPerFish: 30,
  airCargoPerBox: 700,
  ppsStationRun: 5,
  ppsManilaPickup: 5,
  ppsExtra: 20,
  taytayTruckTotal: 8500,
  taytayTruckFish: 225,
  buliluyaTruckTotal: 15000,
  buliluyaTruckFish: 200,
};

/** Focus grades for margin KPI: Red Os, Ss, Gs only */
export const FOCUS_GRADE_KEYS: GradeKey[] = ['o', 's', 'g'];

export const STORAGE_KEY = 'seaworld-cost-desk-v1';
