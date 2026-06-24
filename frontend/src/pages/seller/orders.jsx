import { Printer, Package, Truck, CheckCircle, Loader2, ClipboardList } from 'lucide-react';
import InventoryStatCard from '../../components/seller/inventory/InventoryStatCard';
import toast from 'react-hot-toast';
import OrderQueueTable from '../../components/seller/orders/OrderQueueTable';
import { useState, useEffect } from 'react';
import { shopsAPI, ordersAPI } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { formatPrice } from '../../utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shop, setShop] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  
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
      toast.success('The order has been successfully confirmed. You can now prepare the package.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to confirm order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePrepareOrder = async (orderId) => {
    try {
      setIsActionLoading(true);
      await ordersAPI.prepareOrder(orderId);
      toast.success('Order is now being prepared.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to prepare order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReadyOrder = async (orderId) => {
    try {
      setIsActionLoading(true);
      await ordersAPI.readyOrder(orderId);
      toast.success('Order is now ready for pickup.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to ready order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShipOrder = async (orderId, customDetails = null) => {
    const courierVal = customDetails ? customDetails.courier : courier;
    const trackingVal = customDetails ? customDetails.trackingNumber : trackingNumber;

    if (!courierVal || !trackingVal) {
      toast.error('Please enter both the courier name and tracking number to ship the order.');
      return;
    }
    try {
      setIsActionLoading(true);
      await ordersAPI.shipOrder(orderId, { courier: courierVal, trackingNumber: trackingVal });
      toast.success(`The package is now marked as shipped/dispatched.`);
      setSelectedOrder(null);
      setCourier('');
      setTrackingNumber('');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to mark order as shipped.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      setIsActionLoading(true);
      await ordersAPI.deliverOrder(orderId);
      toast.success('Order is now out for delivery.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update order to out for delivery.');
    } finally {
      setIsActionLoading(false);
    }
  };



  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setIsActionLoading(true);
      await ordersAPI.cancelOrder(orderId);
      toast.success('The order has been successfully cancelled.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => ['confirmed', 'preparing', 'ready_for_pickup'].includes(o.status));
  const shippedOrders = orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status));
  const deliveredOrders = orders.filter(o => ['delivered', 'completed'].includes(o.status));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-sans text-muted-foreground">Loading orders queue...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

      
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
        <Tabs>
          <TabsList>
            <TabsTrigger active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
              All Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger active={activeTab === 'processing'} onClick={() => setActiveTab('processing')}>
              Processing ({confirmedOrders.length})
            </TabsTrigger>
            <TabsTrigger active={activeTab === 'shipped'} onClick={() => setActiveTab('shipped')}>
              Shipped ({shippedOrders.length})
            </TabsTrigger>
            <TabsTrigger active={activeTab === 'delivered'} onClick={() => setActiveTab('delivered')}>
              Delivered ({deliveredOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent active={true}>
            <OrderQueueTable 
              orders={
                activeTab === 'all' ? orders :
                activeTab === 'pending' ? pendingOrders :
                activeTab === 'processing' ? confirmedOrders :
                activeTab === 'shipped' ? shippedOrders :
                deliveredOrders
              }
              totalOrders={
                (activeTab === 'all' ? orders :
                activeTab === 'pending' ? pendingOrders :
                activeTab === 'processing' ? confirmedOrders :
                activeTab === 'shipped' ? shippedOrders :
                deliveredOrders).length.toString()
              }
              currentlyShowing={
                (activeTab === 'all' ? orders :
                activeTab === 'pending' ? pendingOrders :
                activeTab === 'processing' ? confirmedOrders :
                activeTab === 'shipped' ? shippedOrders :
                deliveredOrders).length.toString()
              }
              onSelectOrder={(order) => {
                setSelectedOrder(order);
                setCourier(order.courier || '');
                setTrackingNumber(order.trackingNumber || '');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal Overlay */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          {selectedOrder && (
            <>
              <DialogClose onClick={() => setSelectedOrder(null)} />
          {/* Header */}
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>ID: {selectedOrder?._id}</DialogDescription>
          </DialogHeader>

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
                  {selectedOrder.items?.map((item, idx) => formatPrice(
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]?.url || '/placeholder.jpg'} alt={item.product?.title} className="w-12 h-12 rounded object-cover border border-border" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-[13px]">{item.product?.title || 'Unknown Product'}</p>
                        <p className="text-[10px]">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-foreground">
                        {formatPrice(item.priceAtPurchase)}
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
                    {formatPrice(selectedOrder.total - selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(selectedOrder.shippingFee )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="font-bold text-foreground text-[13px]">Total Paid</span>
                  <span className="font-headline font-bold text-primary text-base">
                    {formatPrice(selectedOrder.total )}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]">Payment Method</span>
                  <span className="text-[10px] font-bold uppercase">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Fulfillment Actions block based on status */}
              {selectedOrder.status !== 'cancelled' && (
                <div className="mt-6 p-4 bg-card border border-border rounded-xl">
                  {selectedOrder.status === 'pending' && (
                    <div className="space-y-3">
                      <p className="text-center text-foreground font-semibold">Ready to fulfill this order?</p>
                      <Button 
                        onClick={() => handleConfirmOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="w-full py-2.5"
                      >
                        Accept & Confirm Order
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'confirmed' && (
                    <div className="space-y-3">
                      <p className="text-center text-foreground font-semibold">Start preparing this order?</p>
                      <Button 
                        onClick={() => handlePrepareOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="w-full py-2.5"
                      >
                        Mark as Preparing
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <div className="space-y-3">
                      {selectedOrder.deliveryType === 'pickup' ? (
                        <>
                          <p className="text-center text-foreground font-semibold">Is the order ready for pickup?</p>
                          <Button 
                            onClick={() => handleReadyOrder(selectedOrder._id)}
                            disabled={isActionLoading}
                            className="w-full py-2.5"
                          >
                            Mark Ready for Pickup
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-foreground font-semibold text-center mb-4">Enter shipping details to dispatch</p>
                          <Input 
                            type="text" 
                            placeholder="Courier Name (e.g. LBC, J&T)"
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                          />
                          <Input 
                            type="text" 
                            placeholder="Tracking Number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                          />
                          <Button 
                            onClick={() => handleShipOrder(selectedOrder._id)}
                            disabled={isActionLoading}
                            className="w-full py-2.5"
                          >
                            Mark as Shipped
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {selectedOrder.status === 'ready_for_pickup' && (
                    <div className="space-y-3">
                      <p className="text-center text-foreground font-semibold">Has the buyer picked up the order?</p>
                      <Button 
                        onClick={() => handleShipOrder(selectedOrder._id, { courier: 'In-Store Pickup', trackingNumber: 'PICKUP' })}
                        disabled={isActionLoading}
                        className="w-full py-2.5"
                      >
                        Handed Over to Buyer
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'shipped' && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-foreground font-semibold">Package is in transit</p>
                        <p className="text-[10px] mt-1">Courier: {selectedOrder.courier} | Tracking: {selectedOrder.trackingNumber}</p>
                      </div>
                      <Button 
                        onClick={() => handleDeliverOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="w-full py-2.5"
                      >
                        Dispatch for Out for Delivery
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'out_for_delivery' && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-foreground font-semibold">Package is Out for Delivery</p>
                        <p className="text-[10px] mt-1">Awaiting buyer to confirm receipt.</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'delivered' && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-foreground font-semibold text-emerald-600">Package Delivered Successfully</p>
                        <p className="text-[10px] mt-1">Awaiting buyer to mark the order as completed.</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-foreground font-semibold text-green-600">Order Completed</p>
                        <p className="text-[10px] mt-1">Payment settled and finalized.</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status !== 'shipped' && selectedOrder.status !== 'out_for_delivery' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'completed' && (
                    <div className="mt-4 text-center">
                      <Button 
                        variant="ghost"
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        disabled={isActionLoading}
                        className="text-[10px] font-bold text-destructive hover:bg-destructive/10 hover:text-destructive w-full"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-between items-center shrink-0">
              <Button variant="ghost" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print Waybill
              </Button>
              <Button onClick={() => setSelectedOrder(null)} variant="outline">
                Close
              </Button>
            </div>
            </>
          )}
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Orders;