import React from 'react';

const SystemAlerts = ({ alerts }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full min-h-[320px]">
      <h3 className="text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase mb-5">
        Pending Verifications
      </h3>

      <div className="flex-1 flex flex-col gap-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex gap-3">
            <div className="mt-1.5 shrink-0">
              <div className={`w-2 h-2 rounded-full ${alert.isUrgent ? 'bg-destructive' : 'bg-primary'}`} />
            </div>
            <div>
              <h4 className="text-[13px] font-sans font-bold text-foreground mb-0.5">
                {alert.title}
              </h4>
              <p className="text-[12px] font-sans text-muted-foreground leading-relaxed mb-1">
                {alert.message}
              </p>
              <div className="text-[9px] font-sans font-bold tracking-widest text-primary uppercase">
                {alert.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;
