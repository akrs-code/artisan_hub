import { Link } from 'react-router-dom';
import { Heart, Map } from 'lucide-react';

export const EmptySavedShops = () => (
  <div className="ec-card empty-state">
    <Heart className="empty-state-icon" />
    <h3 className="empty-state-title">Your Shop Collection is Empty</h3>
    <p className="empty-state-desc mb-6">
      You haven't saved any artisan shops yet. Explore the marketplace map to discover your favourite local creators.
    </p>
    <Link to="/" className="btn-md btn-solid">
      <Map className="w-3.5 h-3.5" />
      Explore Marketplace
    </Link>
  </div>
);
