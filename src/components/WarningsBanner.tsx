import type { StationCalc } from '../types';

interface Props {
  stations: StationCalc[];
}

export function WarningsBanner({ stations }: Props) {
  const losses: string[] = [];
  const low: string[] = [];
  const critical: string[] = [];

  for (const st of stations) {
    for (const g of st.grades) {
      const label = `${st.name} ${g.shortLabel}`;
      if (g.netFish < 0) losses.push(label);
      else if (g.margin * 100 < 5) critical.push(label);
      else if (g.margin * 100 < 10) low.push(label);
    }
  }

  if (losses.length === 0 && critical.length === 0 && low.length === 0) {
    return null;
  }

  return (
    <div className="warnings">
      {losses.length > 0 && (
        <div className="warn-block loss">
          <strong>⚠ Loss-making (net/fish &lt; 0):</strong> {losses.join(', ')}
        </div>
      )}
      {critical.length > 0 && (
        <div className="warn-block critical">
          <strong>Critical margin (&lt;5%):</strong> {critical.join(', ')}
        </div>
      )}
      {low.length > 0 && (
        <div className="warn-block low">
          <strong>Low margin (&lt;10%):</strong> {low.join(', ')}
        </div>
      )}
    </div>
  );
}
