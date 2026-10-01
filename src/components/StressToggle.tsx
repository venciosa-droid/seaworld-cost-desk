interface Props {
  enabled: boolean;
  amount: number;
  onToggle: (v: boolean) => void;
  onAmount: (v: number) => void;
}

const PRESETS = [100, 200, 300, 500];

export function StressToggle({ enabled, amount, onToggle, onAmount }: Props) {
  const isCustom = !PRESETS.includes(amount);

  return (
    <div className="stress-bar">
      <label className="switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span>Stress test: Manila −₱{amount}</span>
      </label>
      <div className="stress-presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`chip ${enabled && amount === p ? 'active' : ''}`}
            onClick={() => {
              onAmount(p);
              onToggle(true);
            }}
          >
            −₱{p}
          </button>
        ))}
        <label className={`chip custom ${enabled && isCustom ? 'active' : ''}`}>
          Custom
          <input
            type="number"
            min={0}
            step={50}
            value={amount}
            onChange={(e) => {
              const n = parseFloat(e.target.value);
              onAmount(Number.isNaN(n) || n < 0 ? 0 : n);
              onToggle(true);
            }}
          />
        </label>
      </div>
    </div>
  );
}
