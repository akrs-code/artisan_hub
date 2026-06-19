import React from 'react';

const PlatformGrowthChart = ({ data }) => {
  // data is expected to be an array of objects: { label: 'OCT 01', value: 40, isHighlighted: false, tooltip: null }
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover min-h-[380px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase leading-relaxed">
            PLATFORM GROWTH
          </h3>
          <p className="text-[13px] font-sans text-[#8C5233] font-medium mt-1">
            Merchant acquisition vs Transaction volume
          </p>
        </div>
        <div className="flex bg-neutral-dark/5 rounded-md p-1">
          <button className="px-3 py-1 rounded text-[10px] font-sans font-bold text-neutral-dark/60 hover:text-neutral-dark transition-colors">
            7D
          </button>
          <button className="px-3 py-1 rounded bg-[#8C5233] text-white text-[10px] font-sans font-bold shadow-sm transition-colors">
            30D
          </button>
          <button className="px-3 py-1 rounded text-[10px] font-sans font-bold text-neutral-dark/60 hover:text-neutral-dark transition-colors">
            90D
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 flex flex-col justify-end relative mt-4">
        <div className="flex justify-between items-end h-full gap-2 sm:gap-4 px-2 pb-8">
          {data.map((item, i) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div 
                key={i} 
                className={`w-full relative transition-colors duration-300 rounded-t-sm group/bar ${item.isHighlighted ? 'bg-[#8C5233]' : 'bg-[#EBE5D9] hover:bg-[#DED7C9]'}`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Tooltip for highlighted bar */}
                {item.isHighlighted && item.tooltip && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-neutral-dark/10 shadow-lg rounded-md p-3 min-w-[140px] z-10 pointer-events-none">
                    <div className="text-[8px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase mb-1 text-center">
                      PEAK PERFORMANCE
                    </div>
                    <div className="text-[14px] font-headline font-bold text-[#8C5233] text-center mb-0.5">
                      {item.tooltip.value}
                    </div>
                    <div className="text-[9px] font-sans text-neutral-dark/60 text-center">
                      {item.tooltip.date}
                    </div>
                    {/* Arrow down */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-neutral-dark/10 transform rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[8px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase">
          {data.map((item, i) => (
            <span key={i} className="w-full text-center">
              {item.showLabel ? item.label : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformGrowthChart;
