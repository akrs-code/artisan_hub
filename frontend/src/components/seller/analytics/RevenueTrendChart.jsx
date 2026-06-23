import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const RevenueTrendChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('Monthly');

  // Assume data contains label and value
  const chartData = {
    labels: data.map(d => d.label || ''),
    datasets: [
      {
        data: data.map(d => d.value || 0),
        backgroundColor: '#C8744C',
        hoverBackgroundColor: '#70341B',
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
          label: (context) => `₱${context.raw}`
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
    <div className="ec-card ec-card-hover p-8 flex flex-col h-full group min-h-[350px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-lg font-headline font-bold text-foreground">Revenue Trend</h2>
          <p className="text-xs font-sans text-muted-foreground mt-1">Income performance tracking</p>
        </div>
        
        <Tabs className="w-auto border-b-0 mb-0">
          <TabsList className="mb-0 border-b-0 gap-4">
            <TabsTrigger
              active={period === 'Weekly'}
              onClick={() => setPeriod('Weekly')}
              className="mr-0 pb-1"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              active={period === 'Monthly'}
              onClick={() => setPeriod('Monthly')}
              className="mr-0 pb-1"
            >
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 w-full relative min-h-[250px] mt-4">
        {data.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            No revenue data.
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueTrendChart;
