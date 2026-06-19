import { Clock, Truck, CheckCircle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
  pending:   { icon: Clock,        variant: 'tertiary',      label: 'Processing' },
  shipped:   { icon: Truck,        variant: 'secondaryDark', label: 'Shipped'    },
  delivered: { icon: CheckCircle,  variant: 'secondaryDark', label: 'Delivered'  },
  default:   { icon: Package,      variant: 'outline',       label: 'Unknown'    },
};

export const StatusBadge = ({ status }) => {
  const { icon: Icon, variant, label } = STATUS_CONFIG[status] || STATUS_CONFIG.default;
  return (
    <Badge variant={variant} className="gap-1.5 py-1">
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </Badge>
  );
};

