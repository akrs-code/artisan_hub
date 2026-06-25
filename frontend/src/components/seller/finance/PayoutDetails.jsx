import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';

const PayoutDetails = ({ nextPayoutDate, scheduleType, bankName, accountEnding, onManageClick }) => {
  return (
    <div className="ec-card ec-card-hover p-8 flex flex-col h-full group mt-6 lg:mt-0">
      <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase leading-relaxed mb-6">
        PAYOUT DETAILS
      </h3>

      {/* Next Scheduled Payout */}
      <div className="mb-8">
        <h4 className="text-[9px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase mb-3">
          NEXT SCHEDULED PAYOUT
        </h4>
        <div className="bg-[#F8F5F0] rounded-lg p-5 border-l-4 border-primary">
          <div className="text-[15px] font-headline font-bold text-neutral-dark mb-1">
            {nextPayoutDate}
          </div>
          <div className="text-[10px] font-sans font-bold text-primary">
            {scheduleType}
          </div>
        </div>
      </div>

      {/* Linked Bank Account */}
      <div className="mb-8">
        <h4 className="text-[9px] font-sans font-bold tracking-widest text-neutral-dark/40 uppercase mb-3">
          LINKED BANK ACCOUNT
        </h4>
        <div className="border border-neutral-dark/10 rounded-lg p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-[#F8F5F0] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-[13px] font-sans font-bold text-neutral-dark mb-0.5">
              {bankName}
            </div>
            <div className="text-[10px] font-sans text-neutral-dark/60">
              Checking **** {accountEnding}
            </div>
          </div>
        </div>
      </div>

      {/* Manage Link */}
      <div className="mt-auto pt-4 text-center">
        <button 
          onClick={onManageClick}
          className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-primary hover:text-primary-dark tracking-widest transition-colors"
        >
          Manage Payout Methods
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PayoutDetails;
