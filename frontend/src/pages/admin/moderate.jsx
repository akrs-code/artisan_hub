import React, { useState, useEffect, useMemo } from 'react';
import { Hourglass, Flag, CheckCircle, Eye, EyeOff, X, Loader2, ExternalLink } from 'lucide-react';
import AdminStatCard from '../../components/admin/dashboard/AdminStatCard';
import { adminAPI } from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';


const ProductDetailModal = ({ product, onClose, onToggleVisibility }) => {
    if (!product) return null;

    return (
        <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 border-border shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-border bg-card">
                    <DialogTitle>
                        <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-0.5 text-left">
                            Product Review
                        </span>
                        <span className="font-headline font-bold text-foreground text-lg leading-tight block text-left">
                            {product.productName}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-5 bg-card">
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-muted border border-border">
                        <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Shop</span>
                            <span className="font-semibold text-foreground">{product.shopName}</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Product ID</span>
                            <span className="font-semibold text-foreground font-mono">{product.id}</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Listed On</span>
                            <span className="font-semibold text-foreground">{product.flaggedDate}</span>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Current Status</span>
                            <span className={`font-bold uppercase tracking-wider ${product.status === 'ACTIVE' ? 'text-green-600' : 'text-destructive'}`}>
                                {product.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border flex gap-3 bg-muted/30">
                    <Button variant="outline" onClick={onClose} className="flex-1 uppercase tracking-widest">
                        Close
                    </Button>
                    <Button
                        variant={product.status === 'ACTIVE' ? 'destructive' : 'default'}
                        onClick={() => onToggleVisibility(product)}
                        className="flex-1"
                    >
                        {product.status === 'ACTIVE' ? (
                            <><EyeOff className="w-3.5 h-3.5 mr-2" /> Hide Listing</>
                        ) : (
                            <><Eye className="w-3.5 h-3.5 mr-2" /> Restore Listing</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Moderate = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getProducts();
            if (res?.data) setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleToggleVisibility = async (product) => {
        try {
            setActionLoading(true);
            await adminAPI.toggleProduct(product.rawId);
            toast.success(`Product ${product.status === 'ACTIVE' ? 'hidden' : 'restored'} successfully.`);
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            toast.error(err.message || 'Failed to update product visibility.');
        } finally {
            setActionLoading(false);
        }
    };

    const flaggedCount = products.filter(p => !p.isActive).length;
    const activeCount = products.filter(p => p.isActive).length;

    const formattedProducts = products.map(p => ({
        rawId: p._id,
        productName: p.name,
        id: p._id.substring(p._id.length - 8).toUpperCase(),
        image: p.imageUrl || 'https://placehold.co/400x400/EBE5D9/8C5233?text=Product',
        shopName: p.shop?.name || 'Unknown Shop',
        flaggedDate: new Date(p.createdAt).toLocaleDateString(),
        status: p.isActive ? 'ACTIVE' : 'HIDDEN',
    }));

    const columns = useMemo(() => [
        {
            header: 'Product',
            accessorKey: 'product',
            cell: ({ row }) => (
                <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
                    {row.original.productName}
                </span>
            )
        },
        {
            header: 'Shop',
            accessorKey: 'shopName',
            cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.shopName}</span>
        },
        {
            header: 'Listed On',
            accessorKey: 'flaggedDate',
            cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.flaggedDate}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                    row.original.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-destructive/10 text-destructive'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${row.original.status === 'ACTIVE' ? 'bg-green-600' : 'bg-destructive'}`} />
                    {row.original.status}
                </span>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            meta: { headerClassName: 'text-center', cellClassName: 'flex justify-center' },
            cell: ({ row }) => (
                <button
                    onClick={() => setSelectedProduct(row.original)}
                    className="text-[12px] text-muted-foreground hover:text-primary transition-colors p-1"
                    title="View Details"
                >
                    <Eye className="w-4 h-4" />
                </button>
            )
        }
    ], []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-sans text-muted-foreground">Loading product listings...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Product Moderation</h1>
                <p className="text-muted-foreground font-sans text-xs">
                    Review and manage listings from the Artisan community.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AdminStatCard title="TOTAL PRODUCTS" value={products.length.toString()} subtext="All platform listings" icon={Hourglass} />
                <AdminStatCard
                    title="HIDDEN / FLAGGED"
                    value={flaggedCount.toString()}
                    subtext={<span className="text-destructive font-bold text-[9px]">Currently Hidden</span>}
                    icon={Flag}
                    iconBgClass="bg-[#F8E2DF]"
                    iconColorClass="text-destructive"
                />
                <AdminStatCard title="ACTIVE LISTINGS" value={activeCount.toString()} subtext="Visible on marketplace" icon={CheckCircle} />
            </div>

            {/* Products Table */}
            <div className="w-full">
                <DataTable
                    title="All Listings"
                    columns={columns}
                    data={formattedProducts}
                    emptyStateMessage="No products found."
                    footer={
                        formattedProducts.length > 0 && (
                            <div className="text-[11px] font-sans text-muted-foreground w-full">
                                Showing <span className="font-bold text-foreground">{formattedProducts.length}</span> products
                            </div>
                        )
                    }
                />
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onToggleVisibility={handleToggleVisibility}
                />
            )}
        </div>
    );
};

export default Moderate;
