import React from 'react';
import { Button } from '../../ui/button';

const PlatformGrowthChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full min-h-[320px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase mb-1">
            Platform Growth
          </h3>
          <p className="text-[13px] font-sans text-primary font-medium">
            Active users vs transaction volume
          </p>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <Button variant="ghost" className="h-7 px-3 text-[10px] font-sans font-bold text-muted-foreground hover:text-foreground">
            7D
          </Button>
          <Button variant="outline" className="h-7 px-3 bg-background text-foreground shadow-sm text-[10px] font-sans font-bold">
            30D
          </Button>
          <Button variant="ghost" className="h-7 px-3 text-[10px] font-sans font-bold text-muted-foreground hover:text-foreground">
            90D
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end relative mt-4">
        <div className="flex justify-between items-end h-full gap-2 sm:gap-4 px-2 pb-8">
          {data.map((item, i) => {
            const heightPercent = (item.value / maxVal) * 100;
            return (
              <div 
                key={i} 
                className={`w-full relative transition-colors duration-300 rounded-t-sm group/bar ${item.isHighlighted ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/20'}`}
                style={{ height: `${heightPercent}%` }}
              >
                {item.isHighlighted && item.tooltip && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-lg rounded-md p-3 min-w-[140px] z-10 pointer-events-none">
                    <div className="text-[8px] font-sans font-bold tracking-widest text-muted-foreground uppercase mb-1 text-center">
                      Peak Traffic
                    </div>
                    <div className="text-[14px] font-headline font-bold text-primary text-center mb-0.5">
                      {item.tooltip.value}
                    </div>
                    <div className="text-[9px] font-sans text-muted-foreground text-center">
                      {item.tooltip.date}
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-b border-r border-border transform rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[8px] font-sans font-bold tracking-widest text-muted-foreground uppercase">
          {data.map((item, i) => (
            <span key={i} className="w-full text-center">
              {item.showLabel ? item.label : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformGrowthChart;
