import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
);

const DailyShipmentsChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.isHighlighted ? '#C8744C' : '#EBE5D9'),
        hoverBackgroundColor: data.map(d => d.isHighlighted ? '#70341B' : '#DED7C9'),
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1A1A1A',
        bodyColor: '#1A1A1A',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.raw} shipments`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          font: { family: 'sans-serif', size: 10, weight: 'bold' },
          color: '#A3A3A3'
        }
      },
      y: {
        display: false,
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="ec-card ec-card-hover p-8 flex flex-col h-full group min-h-[320px]">
      <div className="mb-8 text-center sm:text-left">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase max-w-[60%] leading-relaxed mx-auto sm:mx-0">
          DAILY SHIPMENTS
        </h3>
        <p className="text-[13px] font-sans text-primary font-bold mt-1">
          Last 7 Days
        </p>
      </div>

      <div className="flex-1 w-full relative min-h-[200px] mt-4">
        {data.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            No shipment data.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyShipmentsChart;
