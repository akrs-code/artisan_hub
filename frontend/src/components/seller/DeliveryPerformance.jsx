import React from 'react';
import { Clock } from 'lucide-react';

const DeliveryPerformance = ({ onTimeRate, avgFulfillmentTime, performanceMessage }) => {
  return (
    <div className="card-custom !p-8 flex flex-col h-full group hover:card-custom-hover mt-6 lg:mt-0">
      <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase leading-relaxed mb-6">
        DELIVERY PERFORMANCE
      </h3>

      {/* On-Time Rate */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[13px] font-sans text-neutral-dark/70 font-medium">On-Time Delivery Rate</span>
          <span className="text-[13px] font-sans font-bold text-[#8C5233]">{onTimeRate}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8C5233] rounded-full transition-all duration-1000"
            style={{ width: `${onTimeRate}%` }}
          />
        </div>
      </div>

      {/* Avg Fulfillment Time */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[13px] font-sans text-neutral-dark/70 font-medium mb-1">Avg. Fulfillment Time</div>
          <div className="text-[13px] font-sans font-bold text-neutral-dark">{avgFulfillmentTime} Days</div>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5EDE8] shrink-0">
          <Clock className="w-5 h-5 text-[#8C5233]" />
        </div>
      </div>

      {/* Message */}
      <div className="mt-auto text-center pt-6 border-t border-neutral-dark/10">
        <p className="text-[13px] font-sans italic text-neutral-dark/60">
          "{performanceMessage}"
        </p>
      </div>
    </div>
  );
};

export default DeliveryPerformance;
