import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyCart = () => (
  <div className="page-section">
    <div className="page-header">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-subtitle">Review and manage your selected artisan products.</p>
    </div>

    <div className="glass-card py-0">
      <div className="empty-state">
        <ShoppingBag className="empty-state-icon" />
        <h3 className="empty-state-title">Your Cart is Empty</h3>
        <p className="empty-state-desc">
          You haven't added any items yet. Discover unique handmade pieces from local craftsmen.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            Explore Catalog
          </Link>
        </Button>
      </div>
    </div>
  </div>
);
