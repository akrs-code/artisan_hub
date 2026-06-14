import React, { useState } from 'react';

const SalesPerformance = () => {
  const [period, setPeriod] = useState('Monthly');

  // Dummy data for the bars (height percentages)
  const barData = [30, 45, 25, 55, 40, 65, 50, 75];
  const xLabels = ['Sep 20', 'Sep 27', 'Oct 04', 'Oct 11', 'Oct 18'];

  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-headline font-bold text-neutral-dark">Sales Performance</h2>
          <p className="text-xs font-sans text-neutral-dark/60 mt-1">Revenue growth over the last 30 days</p>
        </div>
        
        {/* Toggle Pill */}
        <div className="nav-pill">
          <button 
            className={`nav-pill-item text-xs w-auto px-4 h-8 ${period === 'Weekly' ? 'active font-semibold' : ''}`}
            onClick={() => setPeriod('Weekly')}
          >
            Weekly
          </button>
          <button 
            className={`nav-pill-item text-xs w-auto px-4 h-8 ${period === 'Monthly' ? 'active !bg-[#7E4C33] font-semibold' : ''}`}
            onClick={() => setPeriod('Monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 flex flex-col justify-end relative min-h-[200px] mt-4">
        <div className="flex justify-between items-end h-full gap-2 px-2 pb-8">
          {barData.map((height, i) => (
            <div 
              key={i} 
              className="w-full bg-[#EBE5D9] hover:bg-[#DED7C9] transition-colors duration-300 rounded-t-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[11px] font-sans font-medium text-neutral-dark/60">
          {xLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPerformance;
