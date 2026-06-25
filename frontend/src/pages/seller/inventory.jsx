import {
    Box,
    TrendingDown,
    AlertCircle,
    MapPin,
    Loader2
} from 'lucide-react';
import InventoryStatCard from '../../components/seller/inventory/InventoryStatCard';
import InventoryTable from '../../components/seller/inventory/InventoryTable';
import { useState, useEffect } from 'react';
import { shopsAPI, productsAPI } from '../../services/api';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const shopRes = await shopsAPI.getOwned();
            if (shopRes?.data) {
                setShop(shopRes.data);
                const productsRes = await productsAPI.getShopProducts(shopRes.data._id);
                if (productsRes?.data) {
                    setProducts(productsRes.data);
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load inventory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleUpdateStock = async (productId, newStock) => {
        try {
            const formData = new FormData();
            formData.append('stockQuantity', newStock.toString());
            await productsAPI.updateProduct(productId, formData);
            fetchInventory();
        } catch (err) {
            alert(err.message || 'Failed to update stock quantity.');
        }
    };

    const lowStockCount = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10).length;
    const outOfStockCount = products.filter(p => (p.stockQuantity || 0) === 0).length;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-sans text-muted-foreground">Loading stock inventory...</p>
            </div>
        );
    }

    const tableItems = products.map(product => ({
        sku: product._id,
        name: product.name,
        description: product.description || '',
        category: product.category || 'GENERAL',
        currentStock: product.stockQuantity || 0,
        reorderPoint: 10,
            status: (product.stockQuantity || 0) === 0 ? 'OUT OF STOCK' : (product.stockQuantity || 0) < 10 ? 'LOW STOCK' : 'IN STOCK',
                image: product.imageUrl || ''
    }));

return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">Inventory Management</h1>
            <p className="text-muted-foreground font-sans text-xs">Monitor, restock, and manage your artisan craft supplies.</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm font-sans text-destructive">
                {error}
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <InventoryStatCard
                title="Total Products"
                value={products.length.toString()}
                subtext="Live products"
                icon={Box}
            />
            <InventoryStatCard
                title="Low Stock"
                value={lowStockCount.toString()}
                subtext="Below reorder point"
                icon={TrendingDown}
            />
            <InventoryStatCard
                title="Out of Stock"
                value={outOfStockCount.toString()}
                subtext="Needs restocking"
                icon={AlertCircle}
            />
            <InventoryStatCard
                title="Store Location"
                value={shop ? '01' : '00'}
                subtext={shop?.address ? shop.address.substring(0, 20) + (shop.address.length > 20 ? '...' : '') : 'No address registered'}
                icon={MapPin}
            />
        </div>

        {/* Inventory Table */}
        <InventoryTable
            items={tableItems}
            totalItems={products.length.toString()}
            currentlyShowing={products.length.toString()}
            onUpdateStock={handleUpdateStock}
        />
    </div>
);
};

export default Inventory;