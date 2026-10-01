import { formatPct, formatPeso, marginClass, netClass } from '../lib/calc';
import type { GradeCalc, StationId } from '../types';

interface Props {
  grades: GradeCalc[];
  title: string;
  highlightFocus?: boolean;
  stressEnabled: boolean;
  stationId: StationId;
  onBreakdown: (stationId: StationId, grade: GradeCalc) => void;
}

function warnLevel(g: GradeCalc): string | null {
  if (g.netFish < 0) return 'loss';
  if (g.margin * 100 < 5) return 'critical';
  if (g.margin * 100 < 10) return 'low';
  if (g.buy + g.fees.total > g.sell) return 'cost-over';
  return null;
}

export function GradeTable({
  grades,
  title,
  highlightFocus,
  stressEnabled,
  stationId,
  onBreakdown,
}: Props) {
  return (
    <div className={`grade-table-card ${highlightFocus ? 'focus-card' : ''}`}>
      <h3>{title}</h3>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Sell</th>
              <th>Buy</th>
              <th>Direct Cost</th>
              <th>Net/Fish</th>
              <th>Margin</th>
              <th>Net/Box</th>
              {stressEnabled && <th>Stress Margin</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => {
              const warn = warnLevel(g);
              return (
                <tr
                  key={g.grade}
                  className={[
                    g.isFocus ? 'row-focus' : '',
                    warn === 'loss' ? 'row-loss' : '',
                    warn === 'critical' ? 'row-critical' : '',
                    warn === 'low' ? 'row-low' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td>
                    <div className="grade-cell">
                      <span className={`dot ${g.color}`} />
                      <div>
                        <strong>{g.shortLabel}</strong>
                        <div className="muted tiny">{g.sizeLabel} · {g.pcs}pcs</div>
                      </div>
                      {warn === 'loss' && <span className="pill loss">LOSS</span>}
                      {warn === 'critical' && <span className="pill critical">&lt;5%</span>}
                      {warn === 'low' && <span className="pill low">&lt;10%</span>}
                      {warn === 'cost-over' && <span className="pill critical">Buy+fees &gt; sell</span>}
                    </div>
                  </td>
                  <td>{formatPeso(g.sell)}</td>
                  <td>{formatPeso(g.buy)}</td>
                  <td>{formatPeso(g.directCost)}</td>
                  <td className={netClass(g.netFish)}>{formatPeso(g.netFish)}</td>
                  <td>
                    <span className={`margin-badge ${marginClass(g.margin)}`}>
                      {formatPct(g.margin)}
                    </span>
                  </td>
                  <td className={netClass(g.netBox)}>{formatPeso(g.netBox)}</td>
                  {stressEnabled && (
                    <td>
                      <span className={`margin-badge ${marginClass(g.stressMargin)}`}>
                        {formatPct(g.stressMargin)}
                      </span>
                    </td>
                  )}
                  <td>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => onBreakdown(stationId, g)}
                    >
                      Breakdown
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
