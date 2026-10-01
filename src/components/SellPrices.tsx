import { GRADES } from '../lib/defaults';
import type { GradeKey, PriceMap } from '../types';
import { PriceInput } from './PriceInput';

interface Props {
  sell: PriceMap;
  onChange: (key: GradeKey, value: number) => void;
}

export function SellPrices({ sell, onChange }: Props) {
  const red = GRADES.filter((g) => g.color === 'red');
  const brown = GRADES.filter((g) => g.color === 'brown');

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Manila Selling Prices</h2>
        <span className="badge">Global · editable (yellow)</span>
      </div>
      <div className="price-tables">
        <div className="price-group">
          <h4 className="group-red">Red</h4>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Size</th>
                <th>Pcs/Box</th>
                <th>Sell ₱</th>
              </tr>
            </thead>
            <tbody>
              {red.map((g) => (
                <tr key={g.key}>
                  <td>
                    <strong>{g.shortLabel}</strong>
                  </td>
                  <td className="muted">{g.sizeLabel}</td>
                  <td>{g.pcs}</td>
                  <td>
                    <PriceInput
                      value={sell[g.key]}
                      onChange={(v) => onChange(g.key, v)}
                      ariaLabel={`Sell ${g.label}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="price-group">
          <h4 className="group-brown">Brown</h4>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Size</th>
                <th>Pcs/Box</th>
                <th>Sell ₱</th>
              </tr>
            </thead>
            <tbody>
              {brown.map((g) => (
                <tr key={g.key}>
                  <td>
                    <strong>{g.shortLabel}</strong>
                  </td>
                  <td className="muted">{g.sizeLabel}</td>
                  <td>{g.pcs}</td>
                  <td>
                    <PriceInput
                      value={sell[g.key]}
                      onChange={(v) => onChange(g.key, v)}
                      ariaLabel={`Sell ${g.label}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
