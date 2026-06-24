import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Clock,
    Percent,
    BadgeCheck,
    Loader2,
    Palette,
    FileText,
    ExternalLink,
    Check,
    X as XIcon,
    AlertCircle,
    User
} from 'lucide-react';
import AdminStatCard from '../../components/admin/dashboard/AdminStatCard';
import ApplicationsTable from '../../components/admin/shops/ApplicationsTable';
import { adminAPI } from '../../services/api';
import { Button } from '@/components/ui/button';

const Verify = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedShop, setSelectedShop] = useState(null);
    const [isActioning, setIsActioning] = useState(false);

    const loadShops = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await adminAPI.getShops();
            setShops(res?.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load shops queue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadShops();
    }, []);

    const handleVerifyAction = async (shopId, status) => {
        const confirmMsg = `Are you sure you want to set this shop status to ${status.toUpperCase()}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            setIsActioning(true);
            await adminAPI.verifyShop(shopId, status);
            alert(`Shop has been successfully ${status}.`);
            setSelectedShop(null);
            await loadShops();
        } catch (err) {
            alert(err.message || 'Failed to update shop status.');
        } finally {
            setIsActioning(false);
        }
    };

    
    const pendingShops = shops.filter(s => s.verificationStatus === 'pending');
    const verifiedShopsCount = shops.filter(s => s.verificationStatus === 'verified').length;
    const rejectedShopsCount = shops.filter(s => s.verificationStatus === 'rejected').length;
    const totalApplications = shops.filter(s => s.verificationStatus && s.verificationStatus !== 'none').length;
    const approvalRate = totalApplications > 0 
        ? Math.round((verifiedShopsCount / totalApplications) * 100) 
        : 100;

    
    const tableData = shops.map(shop => {
        let displayStatus = 'NEW';
        if (shop.verificationStatus === 'pending') displayStatus = 'UNDER REVIEW';
        if (shop.verificationStatus === 'verified') displayStatus = 'VERIFIED';
        if (shop.verificationStatus === 'rejected') displayStatus = 'FLAGGED';

        return {
            _id: shop._id,
            name: shop.name,
            id: `#SHOP-${shop._id.substring(shop._id.length - 4).toUpperCase()}`,
            icon: Palette,
            category: shop.category || 'General Craft',
            appliedOn: new Date(shop.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            score: shop.businessPermitUrl && shop.governmentIdUrl ? 95 : 45, 
            status: displayStatus,
            ownerName: shop.owner?.name || 'Unknown Owner',
            ownerEmail: shop.owner?.email || '',
            description: shop.description || 'No description listed.',
            businessPermitUrl: shop.businessPermitUrl,
            governmentIdUrl: shop.governmentIdUrl,
            verificationStatus: shop.verificationStatus
        };
    });

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-sans text-muted-foreground">Loading verification queue...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                        Seller Verification
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Review shop applications and approve or reject seller accounts.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-sans">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStatCard
                    title="Pending Applications"
                    value={pendingShops.length}
                    subtext="Awaiting Moderation"
                    icon={ClipboardList}
                />
                <AdminStatCard
                    title="Total Applicants"
                    value={totalApplications}
                    subtext="Historical Submission Count"
                    icon={Clock}
                />
                <AdminStatCard
                    title="Approval Rate"
                    value={`${approvalRate}%`}
                    subtext="Historical Approval Ratio"
                    icon={Percent}
                />
                <AdminStatCard
                    title="Verified Shops"
                    value={verifiedShopsCount}
                    subtext="Active Verified Accounts"
                    icon={BadgeCheck}
                />
            </div>

            
            <div className="w-full mb-8">
                <ApplicationsTable
                    data={tableData}
                    onRowClick={(shop) => setSelectedShop(shop)}
                />
            </div>

            
            {selectedShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    
                    <div 
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedShop(null)}
                    />
                    
                    {/* Modal Dialog */}
                    <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transform transition-all">
                        {/* Header */}
                        <div className="sticky top-0 bg-card flex items-center justify-between p-6 border-b border-border z-10">
                            <div>
                                <h3 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
                                    <BadgeCheck className="w-5 h-5 text-primary" />
                                    Review Shop Application
                                </h3>
                                <p className="text-[11px] text-muted-foreground font-sans uppercase tracking-wider mt-0.5">
                                    {selectedShop.id} — Status: {selectedShop.status}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedShop(null)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-2 transition-colors focus:outline-none"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shop Details</span>
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                        <p className="text-sm font-bold text-foreground">{selectedShop.name}</p>
                                        <p className="text-xs text-primary font-medium">{selectedShop.category}</p>
                                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{selectedShop.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Owner Contact</span>
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50 flex items-start gap-2.5">
                                        <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{selectedShop.ownerName}</p>
                                            <p className="text-xs text-muted-foreground">{selectedShop.ownerEmail || 'No email provided'}</p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase">Applied on {selectedShop.appliedOn}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Review */}
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Submitted Verification Documents</span>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Business Permit */}
                                    <div className="border border-border rounded-xl overflow-hidden bg-muted/10 flex flex-col">
                                        <div className="p-3 border-b border-border bg-card flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                                Business Permit
                                            </span>
                                            {selectedShop.businessPermitUrl && (
                                                <a 
                                                    href={selectedShop.businessPermitUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center gap-1"
                                                >
                                                    View Original
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="p-4 flex items-center justify-center flex-1 min-h-[160px]">
                                            {selectedShop.businessPermitUrl ? (
                                                <img 
                                                    src={selectedShop.businessPermitUrl} 
                                                    alt="Business Permit" 
                                                    className="max-h-40 object-contain rounded border shadow-sm"
                                                />
                                            ) : (
                                                <div className="text-center text-muted-foreground p-4">
                                                    <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1.5" />
                                                    <p className="text-xs">No business permit uploaded.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Government ID */}
                                    <div className="border border-border rounded-xl overflow-hidden bg-muted/10 flex flex-col">
                                        <div className="p-3 border-b border-border bg-card flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                                Government ID
                                            </span>
                                            {selectedShop.governmentIdUrl && (
                                                <a 
                                                    href={selectedShop.governmentIdUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center gap-1"
                                                >
                                                    View Original
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="p-4 flex items-center justify-center flex-1 min-h-[160px]">
                                            {selectedShop.governmentIdUrl ? (
                                                <img 
                                                    src={selectedShop.governmentIdUrl} 
                                                    alt="Government ID" 
                                                    className="max-h-40 object-contain rounded border shadow-sm"
                                                />
                                            ) : (
                                                <div className="text-center text-muted-foreground p-4">
                                                    <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1.5" />
                                                    <p className="text-xs">No government ID uploaded.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="sticky bottom-0 bg-muted/30 p-5 border-t border-border flex justify-between items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedShop(null)}
                            >
                                Back to Queue
                            </Button>
                            
                            {selectedShop.verificationStatus === 'pending' && (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleVerifyAction(selectedShop._id, 'rejected')}
                                        disabled={isActioning}
                                    >
                                        <XIcon className="w-4 h-4 mr-1.5" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleVerifyAction(selectedShop._id, 'verified')}
                                        disabled={isActioning}
                                    >
                                        <Check className="w-4 h-4 mr-1.5" />
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Verify;
