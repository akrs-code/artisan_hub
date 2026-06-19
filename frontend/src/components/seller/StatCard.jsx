import React from 'react';

const StatCard = ({ title, value, percentage, trendData, isPositive }) => {
  // Simple SVG sparkline generator based on trendData points (0-100 values)
  const renderSparkline = () => {
    if (!trendData || trendData.length === 0) return null;
    
    const max = Math.max(...trendData);
    const min = Math.min(...trendData);
    const range = max - min || 1;
    
    // Normalize to 0-40 height range, 100 width
    const points = trendData.map((val, i) => {
      const x = (i / (trendData.length - 1)) * 100;
      const y = 40 - ((val - min) / range) * 40;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? 'var(--color-primary)' : 'var(--color-destructive)';

    return (
      <svg viewBox="0 -5 100 50" className="w-24 h-10 overflow-visible mt-2">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="card-custom !p-6 flex flex-col justify-between h-40 group hover:card-custom-hover">
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">
          {title}
        </h3>
        <span className={`text-[11px] font-bold ${isPositive ? 'text-primary' : 'text-neutral-dark/60'}`}>
          {isPositive ? '+' : ''}{percentage}%
        </span>
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <div className="text-3xl font-headline font-bold text-neutral-dark">
          {value}
        </div>
        <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {renderSparkline()}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
