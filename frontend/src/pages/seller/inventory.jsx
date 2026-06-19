import { Users, RotateCcw, Box, TrendingDown, AlertCircle, MapPin } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';
import AlertBanner from '../../components/seller/AlertBanner';
import InventoryStatCard from '../../components/seller/InventoryStatCard';
import InventoryTable from '../../components/seller/InventoryTable';
import RestockForecast from '../../components/seller/RestockForecast';
import InventoryOptimizer from '../../components/seller/InventoryOptimizer';
import ActionModal from '../../components/seller/ActionModal';
import { useState } from 'react';

// --- Dummy Data (Data Contract for Backend) ---
const pageData = {
    userProfile: {
        name: 'Julian Marks',
        role: 'Master Weaver',
        initials: 'JM'
    },
    alert: {
        title: 'Critical Action Required: Low Stock Alert',
        message: '4 items have fallen below their reorder points. Restock recommended immediately.',
        buttonText: 'Review Items'
    },
    stats: {
        totalSkus: { value: '1,284', subtext: '+12 this month', subtextColor: 'text-neutral-dark/50' },
        lowStock: { value: '04', subtext: 'Alerting now', subtextColor: 'text-[#C85746]' },
        outOfStock: { value: '01', subtext: 'Needs removal', subtextColor: 'text-destructive' },
        warehouses: { value: '03', subtext: 'Global hubs', subtextColor: 'text-neutral-dark/50' }
    },
    inventoryItems: [
        {
            sku: 'DY-IND-001',
            name: 'Organic Indigo Dye',
            description: 'Natural Fermentation Base',
            category: 'TEXTILE',
            currentStock: 120,
            reorderPoint: 50,
            status: 'IN STOCK',
            image: 'https://placehold.co/100x100/1E3A8A/FFFFFF?text=Indigo'
        },
        {
            sku: 'TX-SIL-202',
            name: 'Hand-Spun Raw Silk',
            description: 'Natural Ivory, Grade A',
            category: 'TEXTILE',
            currentStock: 12,
            reorderPoint: 20,
            status: 'LOW STOCK',
            image: 'https://placehold.co/100x100/FDE68A/78350F?text=Silk'
        },
        {
            sku: 'CL-TER-509',
            name: 'Terracotta Clay',
            description: 'Fine Grit, Red Earth',
            category: 'CLAY',
            currentStock: 150,
            reorderPoint: 50,
            status: 'IN STOCK',
            image: 'https://placehold.co/100x100/9A3412/FFFFFF?text=Clay'
        },
        {
            sku: 'WD-TEA-991',
            name: 'Reclaimed Teak Planks',
            description: 'Aged 20yrs, 2" thickness',
            category: 'WOOD',
            currentStock: 0,
            reorderPoint: 10,
            status: 'OUT OF STOCK',
            image: 'https://placehold.co/100x100/A8A29E/44403C?text=Teak'
        }
    ],
    forecast: [
        { label: 'MON', value: 30 },
        { label: 'TUE', value: 25 },
        { label: 'WED', value: 45 },
        { label: 'THU', value: 15 },
        { label: 'FRI', value: 35 },
        { label: 'SAT', value: 25 },
        { label: 'SUN', value: 50 }
    ],
    optimizer: {
        title: 'Inventory Optimizer',
        description: 'You can save up to 12% on shipping by consolidating your next 3 supplier orders.',
        buttonText: 'Optimize Orders'
    }
};

const Inventory = () => {
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

    const openModal = (title, message) => {
        setModalState({ isOpen: true, title, message });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

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
                        Inventory Management
                    </h1>
                    <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
                        Monitor, restock, and manage your artisan craft supplies.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => openModal('Manage Suppliers', 'Supplier management tools will be available soon.')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[13px] font-sans font-bold text-neutral-dark transition-colors"
                    >
                        <Users className="w-4 h-4 text-neutral-dark/70" />
                        Manage Suppliers
                    </button>
                    <button 
                        onClick={() => openModal('Update Stock', 'Manual stock update functionality is coming.')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-white text-[13px] font-sans font-bold transition-colors shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Update Stock
                    </button>
                </div>
            </div>

            {/* Alert Banner */}
            <div className="mb-6">
                <AlertBanner
                    title={pageData.alert.title}
                    message={pageData.alert.message}
                    buttonText={pageData.alert.buttonText}
                    onClick={() => openModal('Review Items', 'Low stock items review panel will open here.')}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <InventoryStatCard
                    title="TOTAL SKUS"
                    value={pageData.stats.totalSkus.value}
                    subtext={pageData.stats.totalSkus.subtext}
                    subtextColor={pageData.stats.totalSkus.subtextColor}
                    icon={Box}
                />
                <InventoryStatCard
                    title="LOW STOCK ITEMS"
                    value={pageData.stats.lowStock.value}
                    subtext={pageData.stats.lowStock.subtext}
                    subtextColor={pageData.stats.lowStock.subtextColor}
                    icon={TrendingDown}
                    iconBgClass="bg-[#F8E2DF]"
                />
                <InventoryStatCard
                    title="OUT OF STOCK"
                    value={pageData.stats.outOfStock.value}
                    subtext={pageData.stats.outOfStock.subtext}
                    subtextColor={pageData.stats.outOfStock.subtextColor}
                    icon={AlertCircle}
                    iconBgClass="bg-[#F8E2DF]"
                />
                <InventoryStatCard
                    title="WAREHOUSE LOCATIONS"
                    value={pageData.stats.warehouses.value}
                    subtext={pageData.stats.warehouses.subtext}
                    subtextColor={pageData.stats.warehouses.subtextColor}
                    icon={MapPin}
                />
            </div>

            {/* Table Section */}
            <div className="mb-6">
                <InventoryTable
                    items={pageData.inventoryItems}
                    totalItems="10"
                    currentlyShowing="4"
                />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RestockForecast data={pageData.forecast} />
                </div>
                <div className="lg:col-span-1">
                    <InventoryOptimizer
                        title={pageData.optimizer.title}
                        description={pageData.optimizer.description}
                        buttonText={pageData.optimizer.buttonText}
                        onOptimize={() => openModal('Optimize Orders', 'The inventory optimizer tool is currently under construction.')}
                    />
                </div>
            </div>

            {/* Action Modal */}
            <ActionModal 
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
            />
        </div>
    );
};

export default Inventory;