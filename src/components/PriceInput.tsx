interface Props {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  disabled?: boolean;
}

export function PriceInput({ value, onChange, ariaLabel, disabled }: Props) {
  return (
    <div className="price-input-wrap">
      <span className="peso-prefix">₱</span>
      <input
        type="number"
        className="price-input"
        min={0}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        aria-label={ariaLabel}
        disabled={disabled}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isNaN(n) || n < 0 ? 0 : n);
        }}
      />
    </div>
  );
}
