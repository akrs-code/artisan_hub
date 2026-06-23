import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon }) => {
  return (
    <div className="ec-card p-6 flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-sans font-bold tracking-widest text-muted-foreground uppercase max-w-[60%] leading-relaxed">
          {title}
        </h3>
        {Icon && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-headline font-bold text-foreground mb-1">
          {value}
        </div>
        {subtext && (
          <div className="text-[10px] font-sans font-medium text-muted-foreground">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
