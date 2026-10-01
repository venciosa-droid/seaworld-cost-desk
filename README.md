# SEAWORLD COST DESK — Palawan Station Cost & Margin Calculator

Standalone interactive web app for computing station cost, fees, net/fish, margin, and net/box across PPS, Taytay–Roxas, and Buliluya–Rizal.

**Stack:** Vite + React + TypeScript · Chart.js · localStorage (no backend)

## Quick start

```bash
cd seaworld-cost-desk
npm install
npm run dev
```

Open the URL shown in the terminal (typically **http://localhost:5173/**).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run verify` | Smoke-test PPS Red Os numbers & focus margins |

## Verification (business example)

PPS Red Os (defaults):

- Fees / fish = **₱467.75**
- Net / fish = **₱332.25**
- Margin = **12.78%**
- Net / box = **₱664.50**

Focus margin (avg of Red Os · Ss · Gs):

- PPS ≈ **13.49%**
- Taytay–Roxas ≈ **14.57%**
- Buliluya–Rizal ≈ **12.82%**

Run: `npm run verify`

## Features

- Instant recalc (no Calculate button)
- Manila selling prices + per-station buying prices
- Focus grades (Os · Ss · Gs) KPI + Chart.js bar chart
- Stress test: Manila −₱100/200/300/500/custom
- Cost breakdown modal per station + grade
- Advanced fixed-cost settings
- Named price-set snapshots + history
- Reset to defaults, Export CSV, Print / PDF
- localStorage auto-save
- Mobile-friendly layout

## Project layout

```
src/
  lib/calc.ts       # Fee / net / margin engine (no hardcoded outputs)
  lib/defaults.ts   # Grades, default sell/buy/costs
  lib/storage.ts    # localStorage persistence
  components/       # UI panels, modals, tables, chart
  hooks/useAppState.ts
scripts/verify-calc.mjs
```

## Notes

- Yellow fields are editable prices.
- Margin color scale: ≥20% dark green → &lt;0% red.
- Loss warnings show when net/fish &lt; 0.
