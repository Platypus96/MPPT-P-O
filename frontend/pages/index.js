import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const registerZoomPlugin = async () => {
      try {
        const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
        ChartJS.register(zoomPlugin);
      } catch (err) {
        console.error('Zoom plugin error:', err);
      }
    };
    registerZoomPlugin();
  }, []);

  const simulate = async () => {
    setError('');
    setLoading(true);
    try {
      const V = voltage.split(',').map(Number);
      const I = current.split(',').map(Number);
      if (V.some(isNaN) || I.some(isNaN)) throw new Error('Invalid input values');
      if (V.length !== I.length) throw new Error('Voltage and Current lengths must match');
      const res = await axios.post('http://localhost:8000/simulate/', { voltage: V, current: I });
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError('Simulation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = (xLabel, yLabel) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14, family: 'Inter, sans-serif' } },
      },
      title: { display: false },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (context) {
            const i = context.dataIndex;
            const p = result?.power?.[i]?.toFixed(2);
            const v = result?.voltage?.[i]?.toFixed(2);
            const c = result?.current?.[i]?.toFixed(2);
            const s = result?.step_size?.[i]?.toFixed(4);
            const e = result?.efficiency_trace?.[i]?.toFixed(2);
            return `V=${v}V, I=${c}A, P=${p}W, η=${e}%, Step=${s}`;
          }
        }
      },
      zoom: {
        pan: { enabled: true, mode: 'xy' },
        zoom: { enabled: true, mode: 'xy', speed: 0.1 },
      },
    },
    scales: {
      x: { title: { display: true, text: xLabel } },
      y: { title: { display: true, text: yLabel } },
    },
  });

  const generateChartData = (label, data = [], color, labels = null) => ({
    labels: labels || data.map((_, i) => i),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: `${color}88`,
        fill: false,
        tension: 0.3,
      },
    ],
  });

  return (
    <div className="container">
      <h1 className="title">MPPT Enhanced P&O Simulator</h1>

      <div className="input-section">
        <h2 className="chart-title">Enter Simulation Data</h2>

        <div>
          <label htmlFor="voltage" className="input-label">Voltage (comma-separated)</label>
          <input type="text" id="voltage" className="input-field" placeholder="e.g., 10,20,30" value={voltage} onChange={(e) => setVoltage(e.target.value)} disabled={loading} />
        </div>

        <div>
          <label htmlFor="current" className="input-label">Current (comma-separated)</label>
          <input type="text" id="current" className="input-field" placeholder="e.g., 1,2,3" value={current} onChange={(e) => setCurrent(e.target.value)} disabled={loading} />
        </div>

        <button className={`simulate-button ${loading ? 'loading' : ''}`} onClick={simulate} disabled={loading}>
          {loading ? (<><span className="spinner" />Simulating...</>) : 'Run Simulation'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {result?.pv_curve?.length > 0 && (
        <div className="charts-section">
          <h2 className="charts-section-title">Simulation Results</h2>

          {/* Summary Section */}
          <div className="text-center my-6 font-medium text-gray-700">
            <p>Max Power: <strong>{Math.max(...result.power).toFixed(2)} W</strong></p>
            <p>Efficiency: <strong>{result.metrics?.efficiency_percent}%</strong></p>
            <p>Settling Time Index: <strong>{result.metrics?.settling_time_index}</strong></p>
            <p>Peak Overshoot: <strong>{result.metrics?.overshoot_watt} W</strong></p>
          </div>

          <h2 className="charts-section-subtitle">Support Graphs</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">PV Curve (V vs W)</h3>
              <Line options={chartOptions('Voltage (V)', 'Power (W)')} data={generateChartData('PV Curve', result.pv_curve, '#e53e3e', result.voltage)} />
            </div>
            <div className="chart-card">
              <h3 className="chart-title">IV Curve (V vs I)</h3>
              <Line options={chartOptions('Voltage (V)', 'Current (I)')} data={generateChartData('IV Curve', result.current, '#3182ce', result.voltage)} />
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Step Sizes</h3>
              <Line options={chartOptions('Time Step', 'Step Size')} data={generateChartData('Step Sizes', result.step_size, '#f6ad55')} />
            </div>
          </div>

          <h2 className="charts-section-subtitle">Result Graphs</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Overshoot Trace</h3>
              <Line options={chartOptions('Time Step', 'Overshoot (W)')} data={generateChartData('Overshoot', result.overshoot_trace, '#d53f8c')} />
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Efficiency (%) Over Time</h3>
              <Line options={chartOptions('Time Step', 'Efficiency (%)')} data={generateChartData('Efficiency %', result.efficiency_trace, '#805ad5')} />
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Settling Time Indicator</h3>
              <Line options={chartOptions('Time Step', 'Stable (1 = yes)')} data={generateChartData('Settling Time', result.settling_time_trace, '#4fd1c5')} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
