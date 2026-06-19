import React from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';

const ActivityItem = ({ type, text, timeAgo }) => {
  const Icon = type === 'resolution' ? CheckCircle : MessageSquare;
  const iconColor = type === 'resolution' ? 'text-[#8C5233]' : 'text-destructive';
  const iconBg = type === 'resolution' ? 'bg-[#8C5233]/10' : 'bg-destructive/10';

  return (
    <div className="flex gap-4 mb-6 last:mb-0">
      <div className={`w-8 h-8 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p 
          className="text-[13px] font-sans text-neutral-dark/80 leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <p className="text-[9px] font-sans text-neutral-dark/40 uppercase tracking-widest">
          {timeAgo}
        </p>
      </div>
    </div>
  );
};

const RecentActivityCard = ({ activities, onViewAllClick }) => {
  return (
    <div className="card-custom !p-6 flex flex-col h-full group hover:card-custom-hover">
      <h2 className="text-[15px] font-headline font-bold text-neutral-dark mb-6">
        Recent Activity
      </h2>
      
      <div className="flex-1">
        {activities.map((activity, i) => (
          <ActivityItem 
            key={i} 
            type={activity.type} 
            text={activity.text} 
            timeAgo={activity.timeAgo} 
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-dark/10">
        <button 
          onClick={onViewAllClick}
          className="w-full py-2.5 rounded-md border border-[#8C5233] text-[#8C5233] hover:bg-[#8C5233]/5 text-[11px] font-sans font-bold uppercase tracking-widest transition-colors text-center"
        >
          View Full Activity Log
        </button>
      </div>
    </div>
  );
};

export default RecentActivityCard;
