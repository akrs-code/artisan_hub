import { Printer, Package, Truck, CheckCircle, Loader2, X, ClipboardList } from 'lucide-react';
import InventoryStatCard from '../../components/seller/InventoryStatCard';
import OrderQueueTable from '../../components/seller/OrderQueueTable';
import { useState, useEffect } from 'react';
import { shopsAPI, ordersAPI } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shop, setShop] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const shopRes = await shopsAPI.getOwned();
      if (shopRes && shopRes.data) {
        setShop(shopRes.data);
        const ordersRes = await ordersAPI.getShopOrders(shopRes.data._id);
        if (ordersRes && ordersRes.data) {
          setOrders(ordersRes.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load shop orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    try {
      setIsActionLoading(true);
      await ordersAPI.confirmOrder(orderId);
      alert('The order has been successfully confirmed. You can now prepare the package.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to confirm order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShipOrder = async (orderId) => {
    if (!courier || !trackingNumber) {
      alert('Please enter both the courier name and tracking number to ship the order.');
      return;
    }
    try {
      setIsActionLoading(true);
      await ordersAPI.shipOrder(orderId, { courier, trackingNumber });
      alert(`The package is now in transit with ${courier}. Tracking ID: ${trackingNumber}`);
      setSelectedOrder(null);
      setCourier('');
      setTrackingNumber('');
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to mark order as shipped.');
    } finally {
      setIsActionLoading(false);
    }
  };



  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setIsActionLoading(true);
      await ordersAPI.cancelOrder(orderId);
      alert('The order has been successfully cancelled.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const shippedOrders = orders.filter(o => o.status === 'shipped');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-sans text-muted-foreground">Loading orders queue...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
          Order Fulfillment
        </h1>
        <p className="text-muted-foreground font-sans text-xs">
          Process, ship, and track your artisan orders.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm font-sans text-destructive">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <InventoryStatCard 
          title="Pending Fulfillment" 
          value={pendingOrders.length.toString()} 
          subtext="Needs acceptance"
          icon={ClipboardList}
        />
        <InventoryStatCard 
          title="Awaiting Pickup" 
          value={confirmedOrders.length.toString()} 
          subtext="Ready to ship"
          icon={Package}
        />
        <InventoryStatCard 
          title="In Transit" 
          value={shippedOrders.length.toString()} 
          subtext="En route to buyer"
          icon={Truck}
        />
        <InventoryStatCard 
          title="Delivered" 
          value={deliveredOrders.length.toString()} 
          subtext="Completed sales"
          icon={CheckCircle}
        />
      </div>

      {/* Main Content Layout */}
      <div className="w-full">
        <OrderQueueTable 
          orders={orders}
          totalOrders={orders.length.toString()}
          currentlyShowing={orders.length.toString()}
          onSelectOrder={(order) => {
            setSelectedOrder(order);
            setCourier(order.courier || '');
            setTrackingNumber(order.trackingNumber || '');
          }}
        />
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-soft-xl w-full max-w-lg overflow-hidden transform transition-all my-8 max-h-[90vh] flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h3 className="text-lg font-headline font-bold text-foreground">Order Details</h3>
                <p className="text-[11px] font-sans text-muted-foreground mt-0.5">ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 font-sans text-xs text-muted-foreground space-y-5 text-left">
              {/* Status Banner */}
              <div className="p-3 bg-muted border border-border rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block text-[13px] uppercase tracking-wider">
                    Status: {selectedOrder.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedOrder.status === 'pending' ? 'bg-primary/10 text-primary' :
                  selectedOrder.status === 'confirmed' ? 'bg-muted text-foreground' :
                  selectedOrder.status === 'shipped' ? 'bg-primary/10 text-primary' :
                  selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer and Delivery info */}
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <h4 className="font-bold text-foreground mb-1 uppercase tracking-wide">Customer</h4>
                  <p className="font-semibold text-foreground">{selectedOrder.buyer?.name || 'Guest Buyer'}</p>
                  <p>{selectedOrder.shippingAddress?.email || selectedOrder.buyer?.email || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 uppercase tracking-wide">Delivery Address</h4>
                  <p className="text-foreground">{selectedOrder.shippingAddress?.fullName}</p>
                  <p>{selectedOrder.shippingAddress?.addressLine}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                  <p>Ph: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="border-b border-border pb-4">
                <h4 className="font-bold text-foreground mb-3 uppercase tracking-wide">Items Ordered</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]?.url || '/placeholder.jpg'} alt={item.product?.title} className="w-12 h-12 rounded object-cover border border-border" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-[13px]">{item.product?.title || 'Unknown Product'}</p>
                        <p className="text-[10px]">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-foreground">
                        {(item.priceAtPurchase / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">
                    {((selectedOrder.total - selectedOrder.shippingFee) / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">
                    {(selectedOrder.shippingFee / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="font-bold text-foreground text-[13px]">Total Paid</span>
                  <span className="font-headline font-bold text-primary text-base">
                    {(selectedOrder.total / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]">Payment Method</span>
                  <span className="text-[10px] font-bold uppercase">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Fulfillment Actions block based on status */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="mt-6 p-4 bg-card border border-border rounded-xl">
                  {selectedOrder.status === 'pending' && (
                    <div className="space-y-3">
                      <p className="text-center text-foreground font-semibold">Ready to fulfill this order?</p>
                      <button 
                        onClick={() => handleConfirmOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="w-full py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        Accept & Confirm Order
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === 'confirmed' && (
                    <div className="space-y-3">
                      <p className="text-foreground font-semibold text-center mb-4">Enter shipping details to dispatch</p>
                      <input 
                        type="text" 
                        placeholder="Courier Name (e.g. LBC, J&T)"
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-background border border-border/70 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="Tracking Number"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-background border border-border/70 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <button 
                        onClick={() => handleShipOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="w-full py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        Mark as Shipped
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === 'shipped' && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-foreground font-semibold">Package is in transit</p>
                        <p className="text-[10px] mt-1">Courier: {selectedOrder.courier} | Tracking: {selectedOrder.trackingNumber}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 italic">Awaiting buyer to confirm receipt.</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={isActionLoading}
                      className="text-[10px] font-bold text-destructive hover:underline disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-between items-center shrink-0">
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print Waybill
              </button>
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-3 text-xs font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;