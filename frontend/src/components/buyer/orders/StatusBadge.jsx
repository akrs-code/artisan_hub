import { Clock, Truck, CheckCircle, Package } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { icon: Clock,        color: 'text-tertiary',       bg: 'bg-tertiary/10 border-tertiary/20',      label: 'Processing' },
  shipped:   { icon: Truck,        color: 'text-secondary-dark', bg: 'bg-secondary/10 border-secondary/20',   label: 'Shipped'    },
  delivered: { icon: CheckCircle,  color: 'text-secondary-dark', bg: 'bg-secondary/10 border-secondary/20',   label: 'Delivered'  },
  default:   { icon: Package,      color: 'text-muted-foreground', bg: 'bg-muted border-border',              label: 'Unknown'    },
};

export const StatusBadge = ({ status }) => {
  const { icon: Icon, color, bg, label } = STATUS_CONFIG[status] || STATUS_CONFIG.default;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bg}`}>
      <Icon className={`w-3 h-3 ${color}`} />
      <span className={`text-[9px] font-sans font-bold uppercase tracking-widest ${color}`}>{label}</span>
    </div>
  );
};
