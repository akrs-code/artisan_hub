import React from 'react';
import { Settings, Printer, CircleAlert, ClipboardList, Package, Truck, CheckCircle } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';
import AlertBanner from '../../components/seller/AlertBanner';
import InventoryStatCard from '../../components/seller/InventoryStatCard';
import OrderQueueTable from '../../components/seller/OrderQueueTable';
import DailyShipmentsChart from '../../components/seller/DailyShipmentsChart';
import DeliveryPerformance from '../../components/seller/DeliveryPerformance';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
  userProfile: {
    name: 'Julian Marks',
    role: 'Master Weaver',
    initials: 'JM'
  },
  alert: {
    title: '3 Priority Orders',
    message: 'Ship today to meet your 2-day delivery guarantee. Late shipments may impact seller ratings.',
    buttonText: 'View Priority Queue',
    variant: 'warning'
  },
  stats: {
    pending: { value: '14', subtext: '-2%', subtextColor: 'text-destructive' },
    awaiting: { value: '5', subtext: '+12%', subtextColor: 'text-[#8C5233]' },
    transit: { value: '42', subtext: '+5%', subtextColor: 'text-[#8C5233]' },
    delivered: { value: '128', subtext: '+18%', subtextColor: 'text-[#8C5233]' }
  },
  recentOrders: [
    {
      id: '#ORD-9821',
      date: 'Oct 24, 2023',
      customer: 'Sarah Jenkins',
      product: '2x Organic Indigo Dye',
      status: 'PENDING'
    },
    {
      id: '#ORD-9819',
      date: 'Oct 23, 2023',
      customer: 'Michael Chen',
      product: '1x Hand-Spun Raw Silk',
      status: 'PROCESSING'
    },
    {
      id: '#ORD-9815',
      date: 'Oct 22, 2023',
      customer: 'Emma Watson',
      product: '4x Hand-Carved Spools',
      status: 'READY FOR PICKUP'
    },
    {
      id: '#ORD-9812',
      date: 'Oct 22, 2023',
      customer: 'Robert Downey',
      product: '1x Linen Weaving Kit',
      status: 'PENDING'
    }
  ],
  shipmentsData: [
    { label: 'MON', value: 20, isHighlighted: false },
    { label: 'TUE', value: 30, isHighlighted: false },
    { label: 'WED', value: 25, isHighlighted: false },
    { label: 'THU', value: 40, isHighlighted: false },
    { label: 'FRI', value: 35, isHighlighted: false },
    { label: 'SAT', value: 45, isHighlighted: false },
    { label: 'SUN', value: 15, isHighlighted: true }
  ],
  performance: {
    onTimeRate: 98.5,
    avgFulfillmentTime: '1.2',
    message: 'Excellent performance this week.'
  }
};

const Orders = () => {
  return (
    <div className="relative min-h-full bg-background px-8 pb-12 w-full max-w-[1400px] mx-auto">
      <DashboardHeader 
        user={pageData.userProfile} 
        searchPlaceholder="Search inventory, SKUs, or orders..."
        showSettings={true}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
            Order Fulfilment
          </h1>
          <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
            Process, ship, and track your artisan orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[13px] font-sans font-bold text-neutral-dark transition-colors">
            <Settings className="w-4 h-4 text-neutral-dark/70" />
            Configure Carriers
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold transition-colors shadow-sm">
            <Printer className="w-4 h-4" />
            Print Shipping Labels
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mb-6">
        <AlertBanner 
          title={pageData.alert.title}
          message={pageData.alert.message}
          buttonText={pageData.alert.buttonText}
          variant={pageData.alert.variant}
          icon={CircleAlert}
          onClick={() => console.log('View Priority Queue clicked')}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <InventoryStatCard 
          title="PENDING FULFILLMENT" 
          value={pageData.stats.pending.value} 
          subtext={pageData.stats.pending.subtext}
          subtextColor={pageData.stats.pending.subtextColor}
          icon={ClipboardList}
        />
        <InventoryStatCard 
          title="AWAITING PICKUP" 
          value={pageData.stats.awaiting.value} 
          subtext={pageData.stats.awaiting.subtext}
          subtextColor={pageData.stats.awaiting.subtextColor}
          icon={Package}
        />
        <InventoryStatCard 
          title="IN TRANSIT" 
          value={pageData.stats.transit.value} 
          subtext={pageData.stats.transit.subtext}
          subtextColor={pageData.stats.transit.subtextColor}
          icon={Truck}
        />
        <InventoryStatCard 
          title="DELIVERED (7 DAYS)" 
          value={pageData.stats.delivered.value} 
          subtext={pageData.stats.delivered.subtext}
          subtextColor={pageData.stats.delivered.subtextColor}
          icon={CheckCircle}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Table) */}
        <div className="lg:col-span-2">
          <OrderQueueTable 
            orders={pageData.recentOrders}
            totalOrders={14}
            currentlyShowing="1-4"
          />
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DailyShipmentsChart data={pageData.shipmentsData} />
          <DeliveryPerformance 
            onTimeRate={pageData.performance.onTimeRate}
            avgFulfillmentTime={pageData.performance.avgFulfillmentTime}
            performanceMessage={pageData.performance.message}
          />
        </div>
      </div>

    </div>
  );
};

export default Orders;