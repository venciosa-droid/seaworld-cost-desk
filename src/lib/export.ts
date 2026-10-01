import { formatPct, formatPeso } from './calc';
import type { StationCalc } from '../types';

export function exportCsv(stations: StationCalc[]): void {
  const headers = [
    'Station',
    'Grade',
    'Color',
    'Pcs',
    'Sell',
    'Buy',
    'Fees',
    'DirectCost',
    'NetFish',
    'Margin',
    'NetBox',
  ];
  const rows: string[][] = [headers];
  for (const st of stations) {
    for (const g of st.grades) {
      rows.push([
        st.name,
        g.label,
        g.color,
        String(g.pcs),
        g.sell.toFixed(2),
        g.buy.toFixed(2),
        g.fees.total.toFixed(4),
        g.directCost.toFixed(4),
        g.netFish.toFixed(4),
        (g.margin * 100).toFixed(4),
        g.netBox.toFixed(4),
      ]);
    }
  }
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seaworld-cost-desk-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printSummary(stations: StationCalc[]): string {
  return stations
    .map((st) => {
      const lines = st.grades
        .map(
          (g) =>
            `${g.shortLabel}: sell ${formatPeso(g.sell)} buy ${formatPeso(g.buy)} net ${formatPeso(g.netFish)} (${formatPct(g.margin)})`
        )
        .join('\n');
      return `${st.name} focus ${formatPct(st.focusMargin)}\n${lines}`;
    })
    .join('\n\n');
}
