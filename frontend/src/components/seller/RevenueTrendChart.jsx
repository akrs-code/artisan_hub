import React from 'react';

const RevenueTrendChart = ({ data }) => {
  
  
  

  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover min-h-[320px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase leading-relaxed">
            REVENUE TREND
          </h3>
          <p className="text-[13px] font-sans text-[#8C5233] font-bold mt-1">
            Last 30 Days
          </p>
        </div>
        <button className="px-3 py-1 rounded border border-neutral-dark/10 bg-transparent text-[9px] font-sans font-bold text-neutral-dark/70 tracking-widest uppercase">
          Monthly
        </button>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 flex flex-col justify-end relative mt-4">
        <div className="flex justify-between items-end h-full gap-4 px-2 pb-8">
          {data.map((week, i) => (
            <div key={i} className="flex-1 flex justify-between items-end gap-1 h-full">
              {week.bars.map((bar, j) => (
                <div 
                  key={j} 
                  className={`w-full rounded-t-sm transition-colors duration-300 ${bar.isHighlighted ? 'bg-[#8C5233]' : 'bg-[#EBE5D9] hover:bg-[#DED7C9]'}`}
                  style={{ height: `${bar.value || bar}%` }}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase">
          {data.map((week, i) => (
            <span key={i} className="flex-1 text-center">{week.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
