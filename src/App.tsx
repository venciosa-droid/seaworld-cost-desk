import { useMemo, useState } from 'react';
import { AdvancedSettingsModal } from './components/AdvancedSettingsModal';
import { BuyPrices } from './components/BuyPrices';
import { CostBreakdownModal } from './components/CostBreakdownModal';
import { FocusChart } from './components/FocusChart';
import { GradeTable } from './components/GradeTable';
import { HistoryPanel } from './components/HistoryPanel';
import { KpiCards } from './components/KpiCards';
import { SellPrices } from './components/SellPrices';
import { StressToggle } from './components/StressToggle';
import { WarningsBanner } from './components/WarningsBanner';
import { useAppState } from './hooks/useAppState';
import { exportCsv } from './lib/export';
import type { GradeCalc, StationId } from './types';
import { STATION_NAMES } from './types';
import './App.css';

function App() {
  const {
    state,
    stations,
    setSell,
    setBuy,
    setCosts,
    setStressEnabled,
    setStressAmount,
    resetDefaults,
    saveNamedSet,
    loadSnapshot,
    deleteSnapshot,
  } = useAppState();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<{
    stationId: StationId;
    grade: GradeCalc;
  } | null>(null);
  const [view, setView] = useState<'desk' | 'history'>('desk');

  const stationName = useMemo(
    () => (breakdown ? STATION_NAMES[breakdown.stationId] : ''),
    [breakdown]
  );

  const handleSaveNamed = () => {
    const name = prompt('Name for this price set:', `Prices ${new Date().toLocaleDateString()}`);
    if (!name?.trim()) return;
    const note = prompt('Optional note:') ?? undefined;
    saveNamedSet(name.trim(), note?.trim() || undefined);
    setView('history');
  };

  return (
    <div className="app">
      <header className="app-header no-print-actions">
        <div className="header-inner">
          <div className="brand">
            <div className="logo" aria-hidden>
              🐟
            </div>
            <div>
              <h1>SEAWORLD COST DESK</h1>
              <p>Palawan Station Cost &amp; Margin Calculator</p>
            </div>
          </div>
          <nav className="header-actions">
            <button
              type="button"
              className={`btn btn-ghost ${view === 'desk' ? 'active-nav' : ''}`}
              onClick={() => setView('desk')}
            >
              Desk
            </button>
            <button
              type="button"
              className={`btn btn-ghost ${view === 'history' ? 'active-nav' : ''}`}
              onClick={() => setView('history')}
            >
              History
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setSettingsOpen(true)}>
              Cost Settings
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (confirm('Reset all prices and costs to defaults?')) resetDefaults();
              }}
            >
              Reset
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => exportCsv(stations)}>
              Export CSV
            </button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print / PDF
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view === 'history' ? (
          <HistoryPanel
            history={state.history}
            onLoad={(snap) => {
              loadSnapshot(snap);
              setView('desk');
            }}
            onDelete={deleteSnapshot}
            onSave={handleSaveNamed}
          />
        ) : (
          <>
            <KpiCards stations={stations} stressEnabled={state.stressEnabled} />
            <WarningsBanner stations={stations} />

            <div className="toolbar-row no-print-actions">
              <StressToggle
                enabled={state.stressEnabled}
                amount={state.stressAmount}
                onToggle={setStressEnabled}
                onAmount={setStressAmount}
              />
              <button type="button" className="btn btn-sm" onClick={handleSaveNamed}>
                Save Price Set
              </button>
            </div>

            <div className="layout-2">
              <FocusChart stations={stations} stressEnabled={state.stressEnabled} />
              <SellPrices sell={state.sell} onChange={setSell} />
            </div>

            <BuyPrices buy={state.buy} onChange={setBuy} />

            <section className="panel">
              <div className="panel-header">
                <h2>Focus Grades · Os · Ss · Gs</h2>
                <span className="badge badge-focus">KPI basis</span>
              </div>
              <div className="station-cards">
                {stations.map((st) => (
                  <GradeTable
                    key={`focus-${st.stationId}`}
                    title={`${st.name} · Focus`}
                    grades={st.grades.filter((g) => g.isFocus)}
                    highlightFocus
                    stressEnabled={state.stressEnabled}
                    stationId={st.stationId}
                    onBreakdown={(sid, g) => setBreakdown({ stationId: sid, grade: g })}
                  />
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h2>All Grades by Station</h2>
              </div>
              <div className="station-cards">
                {stations.map((st) => (
                  <GradeTable
                    key={st.stationId}
                    title={`${st.name} · All grades (focus margin ${((st.focusMargin) * 100).toFixed(2)}%)`}
                    grades={st.grades}
                    stressEnabled={state.stressEnabled}
                    stationId={st.stationId}
                    onBreakdown={(sid, g) => setBreakdown({ stationId: sid, grade: g })}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <span>SEAWORLD Cost Desk · Palawan · Auto-saves to localStorage · Instant recalc</span>
      </footer>

      <CostBreakdownModal
        open={!!breakdown}
        stationName={stationName}
        grade={breakdown?.grade ?? null}
        onClose={() => setBreakdown(null)}
      />
      <AdvancedSettingsModal
        open={settingsOpen}
        costs={state.costs}
        onSave={setCosts}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
