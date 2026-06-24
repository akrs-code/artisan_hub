import { Users, RotateCcw, MapPin, Compass } from 'lucide-react';

const CustomerInsights = ({ insights, demographics }) => {
  const repeatRate = insights?.repeatRate ? Number(insights.repeatRate).toFixed(1) : 0;
  const totalCustomers = insights?.totalUniqueCustomers || 0;
  const repeatCustomers = insights?.repeatCustomerCount || 0;
  const singleCustomers = insights?.singleOrderCustomerCount || 0;

  const regions = demographics || [];
  const maxOrders = regions.length > 0 ? Math.max(...regions.map((r) => r.orders)) : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 font-sans">
      {/* Repeat Purchase Behavior */}
      <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Repeat Customer Rate</h3>
          </div>
          <div className="text-center py-6">
            <span className="text-5xl font-extrabold tracking-tight text-primary">
              {repeatRate}%
            </span>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Of your customers buy more than once
            </p>
          </div>
          <div className="w-full bg-muted h-3 rounded-full overflow-hidden mb-6">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${repeatRate}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
          <div className="text-center">
            <span className="text-lg font-bold text-foreground block">{repeatCustomers}</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Loyal Buyers
            </span>
          </div>
          <div className="text-center border-l border-border/60">
            <span className="text-lg font-bold text-foreground block">{singleCustomers}</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              One-time Buyers
            </span>
          </div>
        </div>
      </div>

      {/* Customer Demographics */}
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Top Ordering Regions</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Where your customers are placing orders from. Useful for target marketing and shipping
            logistics.
          </p>
          <div className="space-y-4">
            {regions.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <Compass className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                No shipping locations recorded yet.
              </div>
            ) : (
              regions.map((reg, idx) => {
                const percentage = Math.round((reg.orders / maxOrders) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/75" />
                        {reg.region}
                      </span>
                      <span className="text-muted-foreground font-semibold">
                        {reg.orders} {reg.orders === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500/80 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="border-t border-border/60 pt-4 mt-6 flex justify-between items-center text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          <span>Unique buyers: {totalCustomers}</span>
          <span>Source: Completed Orders</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;
