import React from 'react';

const DailyShipmentsChart = ({ data }) => {
  // data is expected to be an array of objects: { label: 'MON', value: 40, isHighlighted: false }
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover min-h-[320px]">
      <div className="mb-8 text-center sm:text-left">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase max-w-[60%] leading-relaxed mx-auto sm:mx-0">
          DAILY SHIPMENTS
        </h3>
        <p className="text-[13px] font-sans text-[#8C5233] font-bold mt-1">
          Last 7 Days
        </p>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 flex flex-col justify-end relative mt-4">
        <div className="flex justify-between items-end h-full gap-2 px-2 pb-8">
          {data.map((item, i) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div 
                key={i} 
                className={`w-full transition-colors duration-300 rounded-t-sm ${item.isHighlighted ? 'bg-[#8C5233]' : 'bg-[#EBE5D9] hover:bg-[#DED7C9]'}`}
                style={{ height: `${heightPercent}%` }}
              />
            );
          })}
        </div>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[8px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase">
          {data.map((item, i) => (
            <span key={i} className="w-full text-center">{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyShipmentsChart;
