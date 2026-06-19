import React from 'react';
import { MoreVertical, ArrowRight } from 'lucide-react';

const SystemAlerts = ({ alerts, onViewAllClick }) => {
  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover min-h-[380px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase leading-relaxed">
          SYSTEM ALERTS
        </h3>
        <button className="text-neutral-dark/40 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8C5233] rounded-sm">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {alerts.map((alert, index) => (
          <div key={index} className="flex gap-3">
            {/* Indicator Dot */}
            <div className="mt-1.5 shrink-0">
              <div className={`w-2 h-2 rounded-full ${alert.isUrgent ? 'bg-destructive' : 'bg-[#8C5233]'}`}></div>
            </div>
            {/* Content */}
            <div>
              <h4 className="text-[13px] font-sans font-bold text-neutral-dark mb-1">
                {alert.title}
              </h4>
              <p className="text-[12px] font-sans text-neutral-dark/60 leading-relaxed mb-2">
                {alert.message}
              </p>
              <div className="text-[9px] font-sans font-bold tracking-widest text-[#8C5233] uppercase">
                {alert.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-6 pt-4 text-center">
        <button 
          onClick={onViewAllClick}
          className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-[#8C5233] hover:text-[#7E4A2E] tracking-widest transition-colors"
        >
          View All Activity
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SystemAlerts;
