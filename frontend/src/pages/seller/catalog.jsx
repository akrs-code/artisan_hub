import React from 'react';
import { Plus } from 'lucide-react';
import DashboardHeader from '../../components/seller/DashboardHeader';
import CatalogFilterBar from '../../components/seller/CatalogFilterBar';
import ProductCard from '../../components/seller/ProductCard';
import Pagination from '../../components/seller/Pagination';
import DashboardFAB from '../../components/seller/DashboardFAB';
import ActionModal from '../../components/seller/ActionModal';
import { useState } from 'react';

const dummyProducts = [
  {
    id: 1,
    title: 'Hand-thrown Stoneware Bowl',
    category: 'CERAMICS',
    price: '$48.00',
    stock: 12,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/C87A5B/F5F0E8?text=Stoneware+Bowl'
  },
  {
    id: 2,
    title: 'Linen Table Runner',
    category: 'TEXTILES',
    price: '$65.00',
    stock: 8,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/8B7E66/F5F0E8?text=Table+Runner'
  },
  {
    id: 3,
    title: 'Walnut Serving Board',
    category: 'WOODWORK',
    price: '$110.00',
    stock: 0,
    status: 'DRAFT',
    image: 'https://placehold.co/400x300/4A3831/F5F0E8?text=Serving+Board'
  },
  {
    id: 4,
    title: 'Beeswax Candle Set',
    category: 'HOME DECOR',
    price: '$32.00',
    stock: 0,
    status: 'OUT OF STOCK',
    image: 'https://placehold.co/400x300/D4B872/F5F0E8?text=Candle+Set'
  },
  {
    id: 5,
    title: 'Seafoam Blown Vase',
    category: 'GLASSWARE',
    price: '$85.00',
    stock: 5,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/78A39C/F5F0E8?text=Blown+Vase'
  },
  {
    id: 6,
    title: 'Hand-bound Leather Journal',
    category: 'STATIONERY',
    price: '$55.00',
    stock: 24,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/5A3A22/F5F0E8?text=Leather+Journal'
  },
  {
    id: 7,
    title: 'Hand-carved Wooden Spoon Set',
    category: 'WOODWORK',
    price: '$42.00',
    stock: 15,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/8FC8EB/1A3A52?text=Spoon+Set'
  },
  {
    id: 8,
    title: 'Woven Cotton Throw',
    category: 'TEXTILES',
    price: '$75.00',
    stock: 10,
    status: 'ACTIVE',
    image: 'https://placehold.co/400x300/A8D1E7/2B5A73?text=Cotton+Throw'
  }
];

const Catalog = () => {
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

  const openModal = (title, message) => {
    setModalState({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative min-h-full bg-background px-8 pb-12 w-full max-w-[1400px] mx-auto">
      <DashboardHeader />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-neutral-dark mb-1">
            Product Catalog
          </h1>
          <p className="text-[13px] font-sans text-neutral-dark/60 font-medium">
            Manage your handcrafted inventory and listings.
          </p>
        </div>

        {/* Add Product Button */}
        <button 
          onClick={() => openModal('Add New Product', 'The product creation flow will be integrated here.')}
          className="flex items-center justify-center gap-2 btn-primary px-6 py-3 rounded-md bg-[#8C5233] hover:bg-[#7E4A2E] text-sm font-sans font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <CatalogFilterBar />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination />

      <DashboardFAB onClick={() => openModal('Quick Actions', 'Quick action shortcuts will be available in a future update.')} />

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

export default Catalog;