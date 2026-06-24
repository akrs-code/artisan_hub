import React, { useState, useEffect, useMemo } from 'react';
import { Hourglass, Flag, CheckCircle, Eye, EyeOff, X, Loader2, ExternalLink } from 'lucide-react';
import AdminStatCard from '../../components/admin/dashboard/AdminStatCard';
import { adminAPI } from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import { Button } from '@/components/ui/button';


const ProductDetailModal = ({ product, onClose, onToggleVisibility }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-0.5">
                            Product Review
                        </span>
                        <h3 className="font-headline font-bold text-foreground text-lg leading-tight">{product.productName}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                
                <div className="p-6 space-y-5">
                    
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
                <div className="px-6 py-4 border-t border-border flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 uppercase tracking-widest"
                    >
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
            </div>
        </div>
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
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            alert(err.message || 'Failed to update product visibility.');
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img src={row.original.image} alt={row.original.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="text-[13px] font-sans font-bold text-foreground">{row.original.productName}</div>
                        <div className="text-[9px] font-sans text-muted-foreground uppercase tracking-wider">#{row.original.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Shop',
            accessorKey: 'shopName',
            cell: ({ row }) => <span className="text-[13px] font-sans text-foreground font-medium">{row.original.shopName}</span>
        },
        {
            header: 'Listed On',
            accessorKey: 'flaggedDate',
            cell: ({ row }) => <span className="text-[13px] font-sans text-muted-foreground">{row.original.flaggedDate}</span>
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
            meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(row.original)}
                >
                    <ExternalLink className="w-3 h-3 mr-1.5" /> Review
                </Button>
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
