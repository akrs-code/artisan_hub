import React from 'react';

const HealthBar = ({ label, percentage }) => {
  const isHealthy = percentage >= 95;
  const barColor = isHealthy ? 'bg-green-600' : 'bg-destructive';
  const textColor = isHealthy ? 'text-green-600' : 'text-destructive';

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-muted-foreground max-w-[60%] leading-relaxed">
          {label}
        </span>
        <span className={`text-xs font-headline font-bold ${textColor}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const PayoutHealthCard = ({ data, lastUpdated }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col">
      <h2 className="text-base font-headline font-bold text-foreground mb-5">
        Payout Method Health
      </h2>

      <div className="flex-1 flex flex-col justify-center">
        {data.map((item, i) => (
          <HealthBar key={i} label={item.name} percentage={item.health} />
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <span className="text-[10px] font-sans italic text-muted-foreground">
          Last updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
};

export default PayoutHealthCard;
