import React from 'react';

const AdminStatCard = ({ title, value, subtext, subtextColor = 'text-neutral-dark/60', icon: Icon, iconBgClass = 'bg-[#F5EDE8]', iconColorClass = 'text-primary', accentClass = '' }) => {
  return (
    <div className={`card-custom !p-6 flex flex-col justify-between h-40 group hover:card-custom-hover ${accentClass}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase max-w-[70%] leading-relaxed">
          {title}
        </h3>
        {Icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgClass} shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColorClass}`} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-headline font-bold text-neutral-dark mb-1">
          {value}
        </div>
        <div className={`text-[10px] font-sans font-medium ${subtextColor}`}>
          {subtext}
        </div>
      </div>
    </div>
  );
};
export default AdminStatCard;