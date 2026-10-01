/**
 * Smoke / unit verification for PPS Red Os example and focus margins.
 * Run: node scripts/verify-calc.mjs
 */

const DEFAULT_COSTS = {
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

function computeFees(stationId, pcs, costs) {
  const bfarPaper = costs.bfarPaperPer40 / 40;
  const bfarAux = costs.bfarAuxPer100Boxes / 100 / pcs;
  const pcsdInspection = costs.pcsdInspectionPer40 / 40;
  const pcsdPerFish = costs.pcsdPerFish;
  const airCargo = costs.airCargoPerBox / pcs;
  let truckOrStation = 0;
  if (stationId === 'pps') {
    truckOrStation = costs.ppsStationRun + costs.ppsManilaPickup + costs.ppsExtra;
  } else if (stationId === 'taytay') {
    truckOrStation = costs.taytayTruckTotal / costs.taytayTruckFish;
  } else {
    truckOrStation = costs.buliluyaTruckTotal / costs.buliluyaTruckFish;
  }
  return bfarPaper + bfarAux + pcsdInspection + pcsdPerFish + airCargo + truckOrStation;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function pct2(n) {
  return Math.round(n * 10000) / 100;
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

const sell = 2600;
const buy = 1800;
const pcs = 2;
const fees = computeFees('pps', pcs, DEFAULT_COSTS);
const net = sell - buy - fees;
const margin = net / sell;
const netBox = net * pcs;

assert(round2(fees) === 467.75, `PPS Red Os fees = 467.75 (got ${fees})`);
assert(round2(net) === 332.25, `PPS Red Os net = 332.25 (got ${net})`);
assert(pct2(margin) === 12.78, `PPS Red Os margin = 12.78% (got ${pct2(margin)}%)`);
assert(round2(netBox) === 664.5, `PPS Red Os net/box = 664.50 (got ${netBox})`);

const sells = { o: 2600, s: 2300, g: 1700 };
const buys = {
  pps: { o: 1800, s: 1800, g: 1200 },
  taytay: { o: 1800, s: 1700, g: 1200 },
  buliluya: { o: 1800, s: 1700, g: 1200 },
};
const pcsMap = { o: 2, s: 4, g: 6 };

function focusMargin(station) {
  const grades = ['o', 's', 'g'];
  const margins = grades.map((k) => {
    const f = computeFees(station, pcsMap[k], DEFAULT_COSTS);
    const n = sells[k] - buys[station][k] - f;
    return n / sells[k];
  });
  return margins.reduce((a, b) => a + b, 0) / margins.length;
}

const ppsFM = focusMargin('pps');
const tayFM = focusMargin('taytay');
const bulFM = focusMargin('buliluya');

assert(Math.abs(pct2(ppsFM) - 13.49) < 0.02, `PPS focus ~13.49% (got ${pct2(ppsFM)}%)`);
assert(Math.abs(pct2(tayFM) - 14.57) < 0.02, `Taytay focus ~14.57% (got ${pct2(tayFM)}%)`);
assert(Math.abs(pct2(bulFM) - 12.82) < 0.02, `Buliluya focus ~12.82% (got ${pct2(bulFM)}%)`);

console.log('\n--- Detail ---');
console.log({ fees, net, margin: pct2(margin) + '%', netBox });
console.log({
  ppsFocus: pct2(ppsFM) + '%',
  taytayFocus: pct2(tayFM) + '%',
  buliluyaFocus: pct2(bulFM) + '%',
});

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log('\nAll verification checks passed.');
