import React from 'react';
import { TriangleAlert } from 'lucide-react';

const AlertBanner = ({ title, message, buttonText, onClick, variant = 'danger', icon: Icon = TriangleAlert }) => {
  
  let containerClass = "bg-[#FCF1F0] border border-[#EAC2BE]";
  let iconContainerClass = "bg-[#F8E2DF]";
  let iconColor = "text-destructive";
  let buttonClass = "bg-[#C85746] hover:bg-destructive text-white";

  
  if (variant === 'warning') {
    containerClass = "bg-[#F3EBE3] border border-[#E3D4C4]";
    iconContainerClass = "bg-[#EBDDD0]";
    iconColor = "text-[#8C5233]";
    buttonClass = "bg-[#8C5233] hover:bg-[#7E4A2E] text-white";
  }

  return (
    <div className={`${containerClass} rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full`}>
      <div className="flex items-start gap-4">
        <div className={`${iconContainerClass} p-2 rounded-md shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
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
        className={`shrink-0 px-5 py-2.5 rounded-md text-[11px] font-bold tracking-widest uppercase transition-colors ${buttonClass}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default AlertBanner;
