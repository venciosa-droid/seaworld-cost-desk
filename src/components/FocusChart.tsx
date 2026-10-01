import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { StationCalc } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  stations: StationCalc[];
  stressEnabled: boolean;
}

export function FocusChart({ stations, stressEnabled }: Props) {
  const data = {
    labels: stations.map((s) => s.name),
    datasets: [
      {
        label: 'Focus Margin %',
        data: stations.map((s) => +(s.focusMargin * 100).toFixed(2)),
        backgroundColor: ['#0d7377', '#14919b', '#2dd4bf'],
        borderRadius: 6,
      },
      ...(stressEnabled
        ? [
            {
              label: 'Stress Focus Margin %',
              data: stations.map((s) => +(s.stressFocusMargin * 100).toFixed(2)),
              backgroundColor: ['#f59e0b', '#fbbf24', '#fcd34d'],
              borderRadius: 6,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            `${ctx.dataset.label ?? ''}: ${ctx.parsed.y?.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v: string | number) => `${v}%`,
        },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="chart-card">
      <h3>Focus Margin by Station</h3>
      <div className="chart-wrap">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
