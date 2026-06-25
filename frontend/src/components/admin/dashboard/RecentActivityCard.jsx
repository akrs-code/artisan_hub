import React from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';

const ActivityItem = ({ type, text, timeAgo }) => {
  const Icon = type === 'resolution' ? CheckCircle : MessageSquare;
  const iconColor = type === 'resolution' ? 'text-primary' : 'text-destructive';
  const iconBg = type === 'resolution' ? 'bg-primary/10' : 'bg-destructive/10';

  return (
    <div className="flex gap-3 mb-5 last:mb-0">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p
          className="text-sm font-sans text-foreground leading-relaxed mb-0.5"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <p className="text-[9px] font-sans text-muted-foreground uppercase tracking-widest">
          {timeAgo}
        </p>
      </div>
    </div>
  );
};

const RecentActivityCard = ({ activities, onViewAllClick }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
      <h2 className="text-base font-headline font-bold text-foreground mb-5">
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

      <div className="mt-5 pt-4 border-t border-border">
        <button
          onClick={onViewAllClick}
          className="w-full py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-sans font-semibold transition-colors text-center"
        >
          View Full Activity Log
        </button>
      </div>
    </div>
  );
};

export default RecentActivityCard;
