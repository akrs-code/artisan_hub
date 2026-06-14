import React from 'react';
import { TriangleAlert } from 'lucide-react';

const AlertBanner = ({ title, message, buttonText, onClick }) => {
  return (
    <div className="bg-[#FCF1F0] border border-[#EAC2BE] rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
      <div className="flex items-start gap-4">
        <div className="bg-[#F8E2DF] p-2 rounded-md shrink-0 mt-0.5">
          <TriangleAlert className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h4 className="text-[13px] font-sans font-bold text-neutral-dark mb-1">
            {title}
          </h4>
          <p className="text-[13px] font-sans text-neutral-dark/70">
            {message}
          </p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="shrink-0 bg-[#C85746] hover:bg-destructive text-white px-5 py-2.5 rounded-md text-[11px] font-bold tracking-widest uppercase transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default AlertBanner;
