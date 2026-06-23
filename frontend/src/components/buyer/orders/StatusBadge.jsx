import { Clock, Truck, CheckCircle, Package, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending:            { icon: Clock,        color: 'bg-amber-50 text-amber-700 border-amber-200',    label: 'Processing'   },
  confirmed:          { icon: Package,      color: 'bg-blue-50 text-blue-700 border-blue-200',       label: 'Confirmed'    },
  accepted:           { icon: Package,      color: 'bg-blue-50 text-blue-700 border-blue-200',       label: 'Accepted'     },
  shipped:            { icon: Truck,        color: 'bg-primary/10 text-primary border-primary/20',   label: 'Shipped'      },
  out_for_delivery:   { icon: Truck,        color: 'bg-primary/10 text-primary border-primary/20',   label: 'Out for Delivery' },
  delivered:          { icon: CheckCircle,  color: 'bg-green-50 text-green-700 border-green-200',    label: 'Delivered'    },
  completed:          { icon: CheckCircle,  color: 'bg-green-50 text-green-700 border-green-200',    label: 'Completed'    },
  cancelled:          { icon: XCircle,      color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Cancelled' },
  default:            { icon: Package,      color: 'bg-muted text-muted-foreground border-border',   label: 'Unknown'      },
};

export const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() ?? 'default';
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.default;
  const { icon: Icon, color, label } = config;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${color}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {label}
    </span>
  );
};
