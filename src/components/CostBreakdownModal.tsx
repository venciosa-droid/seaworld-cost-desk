import { formatPct, formatPeso } from '../lib/calc';
import type { GradeCalc } from '../types';

interface Props {
  open: boolean;
  stationName: string;
  grade: GradeCalc | null;
  onClose: () => void;
}

export function CostBreakdownModal({ open, stationName, grade, onClose }: Props) {
  if (!open || !grade) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="breakdown-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="breakdown-title">
            Cost Breakdown · {stationName} · {grade.label}
          </h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="breakdown-summary">
            <div>
              <span className="muted">Sell</span>
              <strong>{formatPeso(grade.sell)}</strong>
            </div>
            <div>
              <span className="muted">Buy</span>
              <strong>{formatPeso(grade.buy)}</strong>
            </div>
            <div>
              <span className="muted">Pcs/Box</span>
              <strong>{grade.pcs}</strong>
            </div>
          </div>

          <h4>Fees / Fish</h4>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Component</th>
                <th>Note</th>
                <th>₱/fish</th>
              </tr>
            </thead>
            <tbody>
              {grade.fees.labels.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td className="muted">{row.note ?? '—'}</td>
                  <td>{formatPeso(row.value)}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={2}>
                  <strong>Total Fees</strong>
                </td>
                <td>
                  <strong>{formatPeso(grade.fees.total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <h4>Result</h4>
          <div className="result-grid">
            <div>
              <span className="muted">Total Cost (buy + fees)</span>
              <strong>{formatPeso(grade.buy + grade.fees.total)}</strong>
            </div>
            <div>
              <span className="muted">Net / Fish</span>
              <strong className={grade.netFish >= 0 ? 'net-pos' : 'net-neg'}>
                {formatPeso(grade.netFish)}
              </strong>
            </div>
            <div>
              <span className="muted">Margin</span>
              <strong>{formatPct(grade.margin)}</strong>
            </div>
            <div>
              <span className="muted">Net / Box</span>
              <strong className={grade.netBox >= 0 ? 'net-pos' : 'net-neg'}>
                {formatPeso(grade.netBox)}
              </strong>
            </div>
          </div>
          <p className="formula muted">
            Net/Fish = Sell − Buy − Fees · Margin = Net/Fish ÷ Sell · Net/Box = Net/Fish × Pcs
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
