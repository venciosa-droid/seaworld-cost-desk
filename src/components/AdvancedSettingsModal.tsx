import { useEffect, useState } from 'react';
import { DEFAULT_COSTS } from '../lib/defaults';
import type { FixedCosts } from '../types';

interface Props {
  open: boolean;
  costs: FixedCosts;
  onSave: (costs: FixedCosts) => void;
  onClose: () => void;
}

type Field = {
  key: keyof FixedCosts;
  label: string;
  hint: string;
};

const FIELDS: Field[] = [
  { key: 'bfarPaperPer40', label: 'BFAR paper (per 40 fish)', hint: 'Default 100 → 2.50/fish' },
  { key: 'bfarAuxPer100Boxes', label: 'BFAR aux (per 100 boxes)', hint: 'Default 10000 → 100/box' },
  { key: 'pcsdInspectionPer40', label: 'PCSD inspection (per 40)', hint: 'Default 210 → 5.25/fish' },
  { key: 'pcsdPerFish', label: 'PCSD per fish', hint: 'Default 30' },
  { key: 'airCargoPerBox', label: 'Air cargo / box', hint: 'Default 700' },
  { key: 'ppsStationRun', label: 'PPS station run', hint: 'Default 5' },
  { key: 'ppsManilaPickup', label: 'PPS Manila pickup', hint: 'Default 5' },
  { key: 'ppsExtra', label: 'PPS extra', hint: 'Default 20' },
  { key: 'taytayTruckTotal', label: 'Taytay truck total', hint: 'Default 8500' },
  { key: 'taytayTruckFish', label: 'Taytay truck fish count', hint: 'Default 225' },
  { key: 'buliluyaTruckTotal', label: 'Buliluya truck total', hint: 'Default 15000' },
  { key: 'buliluyaTruckFish', label: 'Buliluya truck fish count', hint: 'Default 200' },
];

export function AdvancedSettingsModal({ open, costs, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<FixedCosts>(costs);

  useEffect(() => {
    if (open) setDraft(costs);
  }, [open, costs]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="settings-title">Advanced Cost Settings</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="muted">
            These fixed costs feed fee formulas per station and grade. Changes save to localStorage.
          </p>
          <div className="settings-grid">
            {FIELDS.map((f) => (
              <label key={f.key} className="field">
                <span>{f.label}</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="price-input settings-input"
                  value={draft[f.key]}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    setDraft((d) => ({
                      ...d,
                      [f.key]: Number.isNaN(n) || n < 0 ? 0 : n,
                    }));
                  }}
                />
                <span className="hint">{f.hint}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setDraft({ ...DEFAULT_COSTS })}
          >
            Reset cost defaults
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
          >
            Save costs
          </button>
        </div>
      </div>
    </div>
  );
}
