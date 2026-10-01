import { formatPct, formatPeso, marginClass } from '../lib/calc';
import type { StationCalc } from '../types';

interface Props {
  stations: StationCalc[];
  stressEnabled: boolean;
}

export function KpiCards({ stations, stressEnabled }: Props) {
  const allLoss = stations.reduce((s, st) => s + st.lossCount, 0);
  const allNetBoxes = stations.flatMap((st) =>
    st.grades.map((g) => ({
      station: st.name,
      grade: g.shortLabel,
      value: g.netBox,
    }))
  );
  const best = allNetBoxes.reduce((a, b) => (b.value > a.value ? b : a));
  const worst = allNetBoxes.reduce((a, b) => (b.value < a.value ? b : a));

  return (
    <div className="kpi-grid">
      {stations.map((st) => (
        <div key={st.stationId} className={`kpi-card ${marginClass(st.focusMargin)}`}>
          <div className="kpi-label">Focus Margin · {st.name}</div>
          <div className="kpi-value">{formatPct(st.focusMargin)}</div>
          {stressEnabled && (
            <div className="kpi-stress">
              Stress: {formatPct(st.stressFocusMargin)}
            </div>
          )}
          <div className="kpi-sub">Os · Ss · Gs average</div>
        </div>
      ))}
      <div className="kpi-card kpi-meta">
        <div className="kpi-label">Best Net/Box</div>
        <div className={`kpi-value ${best.value >= 0 ? 'net-pos' : 'net-neg'}`}>
          {formatPeso(best.value)}
        </div>
        <div className="kpi-sub">
          {best.station} · {best.grade}
        </div>
      </div>
      <div className="kpi-card kpi-meta">
        <div className="kpi-label">Worst Net/Box</div>
        <div className={`kpi-value ${worst.value >= 0 ? 'net-pos' : 'net-neg'}`}>
          {formatPeso(worst.value)}
        </div>
        <div className="kpi-sub">
          {worst.station} · {worst.grade}
        </div>
      </div>
      <div className={`kpi-card kpi-meta ${allLoss > 0 ? 'kpi-warn' : ''}`}>
        <div className="kpi-label">Loss-Making Grades</div>
        <div className={`kpi-value ${allLoss > 0 ? 'net-neg' : 'net-pos'}`}>
          {allLoss}
        </div>
        <div className="kpi-sub">across all stations</div>
      </div>
    </div>
  );
}
