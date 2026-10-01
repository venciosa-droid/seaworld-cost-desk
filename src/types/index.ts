export type ColorGroup = 'red' | 'brown';
export type GradeKey =
  | 'xo' | 'o' | 's' | 'g' | 'u'
  | 'brown_xo' | 'brown_o' | 'brown_s' | 'brown_g' | 'brown_u';

export type StationId = 'pps' | 'taytay' | 'buliluya';

export interface GradeDef {
  key: GradeKey;
  label: string;
  shortLabel: string;
  color: ColorGroup;
  pcs: number;
  sizeLabel: string;
}

export interface FixedCosts {
  bfarPaperPer40: number;
  bfarAuxPer100Boxes: number;
  pcsdInspectionPer40: number;
  pcsdPerFish: number;
  airCargoPerBox: number;
  ppsStationRun: number;
  ppsManilaPickup: number;
  ppsExtra: number;
  taytayTruckTotal: number;
  taytayTruckFish: number;
  buliluyaTruckTotal: number;
  buliluyaTruckFish: number;
}

export type PriceMap = Record<GradeKey, number>;
export type StationBuyMap = Record<StationId, PriceMap>;

export interface FeeBreakdown {
  bfarPaper: number;
  bfarAux: number;
  pcsdInspection: number;
  pcsdPerFish: number;
  airCargo: number;
  truckOrStation: number;
  total: number;
  labels: { name: string; value: number; note?: string }[];
}

export interface GradeCalc {
  grade: GradeKey;
  label: string;
  shortLabel: string;
  color: ColorGroup;
  pcs: number;
  sizeLabel: string;
  sell: number;
  buy: number;
  fees: FeeBreakdown;
  directCost: number;
  netFish: number;
  margin: number;
  netBox: number;
  stressNetFish: number;
  stressMargin: number;
  stressNetBox: number;
  isLoss: boolean;
  isFocus: boolean;
}

export interface StationCalc {
  stationId: StationId;
  name: string;
  grades: GradeCalc[];
  focusMargin: number;
  stressFocusMargin: number;
  lossCount: number;
  bestNetBox: { grade: string; value: number };
  worstNetBox: { grade: string; value: number };
}

export interface PriceSnapshot {
  id: string;
  name: string;
  createdAt: string;
  sell: PriceMap;
  buy: StationBuyMap;
  costs: FixedCosts;
  note?: string;
}

export interface AppState {
  sell: PriceMap;
  buy: StationBuyMap;
  costs: FixedCosts;
  stressEnabled: boolean;
  stressAmount: number;
  history: PriceSnapshot[];
}

export const STATION_NAMES: Record<StationId, string> = {
  pps: 'PPS',
  taytay: 'Taytay–Roxas',
  buliluya: 'Buliluya–Rizal',
};
