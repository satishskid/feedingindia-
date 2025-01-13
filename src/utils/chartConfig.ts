import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScaleOptions,
  ChartOptions,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export const defaultChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0 // Disable animations for better performance
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 30,
        padding: 15,
        usePointStyle: true,
      },
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      type: 'linear' as const,
      display: true,
      title: {
        display: true,
        text: 'Age (months)',
        font: {
          size: 12,
          weight: '500',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        maxTicksLimit: 12,
        callback: function(value) {
          return Math.round(Number(value));
        }
      },
    },
    y: {
      type: 'linear' as const,
      display: true,
      title: {
        display: true,
        text: 'Value',
        font: {
          size: 12,
          weight: '500',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
};
