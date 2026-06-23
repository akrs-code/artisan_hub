import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export const EmptyCart = () => (
  <div className="page-section animate-in fade-in duration-500">
    <div className="page-header">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-subtitle">Review and manage your selected artisan products.</p>
    </div>

    <div className="ec-card py-0">
      <div className="empty-state">
        <ShoppingBag className="empty-state-icon" />
        <h3 className="empty-state-title">Your Cart is Empty</h3>
        <p className="empty-state-desc">
          You haven't added any items yet. Discover unique handmade pieces from local craftsmen.
        </p>
        <Link
          to="/"
          className="btn-md btn-solid mt-6"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  </div>
);
