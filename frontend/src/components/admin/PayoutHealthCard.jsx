import React from 'react';

const HealthBar = ({ label, percentage }) => {
  const isHealthy = percentage >= 95;
  const colorClass = isHealthy ? "bg-[#16A34A] text-[#16A34A]" : "bg-destructive text-destructive";

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-neutral-dark/60 max-w-[60%] leading-relaxed">
          {label}
        </span>
        <span className={`text-[11px] font-headline font-bold ${colorClass.split(' ')[1]}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#EBE5D9] rounded-full overflow-hidden flex">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass.split(' ')[0]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const PayoutHealthCard = ({ data, lastUpdated }) => {
  return (
    <div className="card-custom !p-8 h-full flex flex-col group hover:card-custom-hover">
      <h2 className="text-[15px] font-headline font-bold text-neutral-dark mb-6">
        Payout Method Health
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        {data.map((item, i) => (
          <HealthBar key={i} label={item.name} percentage={item.health} />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-dark/10">
        <span className="text-[10px] font-sans italic text-neutral-dark/40">
          Last updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
};

export default PayoutHealthCard;
