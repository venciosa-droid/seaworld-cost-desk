import { formatPeso } from '../lib/calc';
import type { PriceSnapshot } from '../types';

interface Props {
  history: PriceSnapshot[];
  onLoad: (snap: PriceSnapshot) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
}

export function HistoryPanel({ history, onLoad, onDelete, onSave }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Price Sets & History</h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave}>
          Save current as named set
        </button>
      </div>
      {history.length === 0 ? (
        <p className="muted">No saved price sets yet. Save a snapshot to compare later.</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Saved</th>
                <th>Red Os sell</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>
                    <strong>{h.name}</strong>
                  </td>
                  <td className="muted">
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                  <td>{formatPeso(h.sell.o)}</td>
                  <td className="muted">{h.note || '—'}</td>
                  <td className="actions">
                    <button type="button" className="btn-link" onClick={() => onLoad(h)}>
                      Load
                    </button>
                    <button
                      type="button"
                      className="btn-link danger"
                      onClick={() => {
                        if (confirm(`Delete price set "${h.name}"?`)) onDelete(h.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
