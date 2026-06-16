import React from 'react';

const ReasonBar = ({ label, percentage }) => {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-dark/60">
          {label}
        </span>
        <span className="text-[10px] font-sans font-bold text-neutral-dark">
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#EBE5D9] rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-[#8C5233] rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const DisputeReasonsCard = ({ data, trend }) => {
  return (
    <div className="card-custom !p-6 flex flex-col h-full hover:card-custom-hover group">
      <h2 className="text-[15px] font-headline font-bold text-neutral-dark mb-6">
        Dispute Reasons
      </h2>
      
      <div className="flex-1">
        {data.map((item, i) => (
          <ReasonBar key={i} label={item.reason} percentage={item.percentage} />
        ))}
      </div>

      <div className="mt-8 bg-neutral-dark/5 rounded-lg p-5">
        <h4 className="text-[9px] font-sans font-bold tracking-widest uppercase text-[#8C5233] mb-2">
          Trend Analysis
        </h4>
        <p className="text-[12px] font-sans text-neutral-dark/70 leading-relaxed">
          {trend}
        </p>
      </div>
    </div>
  );
};

export default DisputeReasonsCard;
