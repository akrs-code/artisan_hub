import React from 'react';

const RestockForecast = ({ data }) => {
  
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="ec-card ec-card-hover p-8 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-headline font-bold text-neutral-dark">Restock Forecast</h2>
          <p className="text-xs font-sans text-neutral-dark/60 mt-1">Next 30 Days</p>
        </div>
        
        <div className="text-[10px] font-sans font-bold tracking-widest text-primary uppercase text-right w-16 leading-tight">
          ANALYTIC<br/>S
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="flex-1 flex flex-col justify-end relative min-h-[160px] mt-4">
        <div className="flex justify-between items-end h-full gap-3 px-2 pb-8">
          {data.map((item, i) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div 
                key={i} 
                className="w-full bg-[#EBE5D9] hover:bg-[#DED7C9] transition-colors duration-300 rounded-t-sm"
                style={{ height: `${heightPercent}%` }}
              />
            );
          })}
        </div>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[9px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase">
          {data.map((item, i) => (
            <span key={i} className="w-full text-center">{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestockForecast;
