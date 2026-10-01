import { useState } from 'react';
import { GRADES } from '../lib/defaults';
import type { GradeKey, StationBuyMap, StationId } from '../types';
import { STATION_NAMES } from '../types';
import { PriceInput } from './PriceInput';

interface Props {
  buy: StationBuyMap;
  onChange: (station: StationId, key: GradeKey, value: number) => void;
}

const STATIONS: StationId[] = ['pps', 'taytay', 'buliluya'];

export function BuyPrices({ buy, onChange }: Props) {
  const [tab, setTab] = useState<StationId>('pps');
  const red = GRADES.filter((g) => g.color === 'red');
  const brown = GRADES.filter((g) => g.color === 'brown');

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Station Buying Prices</h2>
        <span className="badge">Per station · editable (yellow)</span>
      </div>
      <div className="tabs" role="tablist">
        {STATIONS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            {STATION_NAMES[id]}
          </button>
        ))}
      </div>
      <div className="price-tables">
        <div className="price-group">
          <h4 className="group-red">Red · {STATION_NAMES[tab]}</h4>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Buy ₱</th>
              </tr>
            </thead>
            <tbody>
              {red.map((g) => (
                <tr key={g.key}>
                  <td>
                    <strong>{g.shortLabel}</strong>
                  </td>
                  <td>
                    <PriceInput
                      value={buy[tab][g.key]}
                      onChange={(v) => onChange(tab, g.key, v)}
                      ariaLabel={`Buy ${g.label} ${STATION_NAMES[tab]}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="price-group">
          <h4 className="group-brown">Brown · {STATION_NAMES[tab]}</h4>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Buy ₱</th>
              </tr>
            </thead>
            <tbody>
              {brown.map((g) => (
                <tr key={g.key}>
                  <td>
                    <strong>{g.shortLabel}</strong>
                  </td>
                  <td>
                    <PriceInput
                      value={buy[tab][g.key]}
                      onChange={(v) => onChange(tab, g.key, v)}
                      ariaLabel={`Buy ${g.label} ${STATION_NAMES[tab]}`}
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
