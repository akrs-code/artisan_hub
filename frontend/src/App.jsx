import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import {
  BuyerSidebar,
  SellerSidebar,
  AdminSidebar,
} from './components/RoleBasedSidebar';
import WorkspaceView from './components/WorkspaceView';


import { CartProvider } from './context/CartContext';

// Auth Pages
import Login from './pages/shared/Login';
import Signup from './pages/shared/Signup';
import SellerVerification from './pages/shared/SellerVerification';

// Buyer Pages
import MapDiscovery from './pages/buyer/MapDiscovery';
import Discover from './pages/buyer/Discover';
import SavedShops from './pages/buyer/SavedShops';
import ShopDetail from './pages/buyer/ShopDetail';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Orders from './pages/buyer/Orders';
import BuyerProfile from './pages/buyer/BuyerProfile';

// Seller Pages
import Dashboard from './pages/seller/dashboard';
import Catalog from './pages/seller/catalog';
import Inventory from './pages/seller/inventory';
import SellerOrders from './pages/seller/orders';
import Earnings from './pages/seller/earnings';

// Admin Pages
import Overview from './pages/admin/overview';
import Verify from './pages/admin/verify';
import Moderate from './pages/admin/moderate';
import Users from './pages/admin/users';
import Logs from './pages/admin/logs';
import Disputes from './pages/admin/disputes';

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/verify-seller" element={<SellerVerification />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={<RootLayout sidebarContent={<AdminSidebar />} />}
        >
          <Route path="overview" element={<Overview />} />
          <Route path="verify" element={<Verify />} />
          <Route path="moderate" element={<Moderate />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<Logs />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="*" element={<WorkspaceView />} />
        </Route>

        {/* Seller Routes */}
        <Route
          path="/seller/*"
          element={<RootLayout sidebarContent={<SellerSidebar />} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="*" element={<WorkspaceView />} />
        </Route>

        {/* Buyer Routes */}
        <Route
          path="/*"
          element={<RootLayout sidebarContent={<BuyerSidebar />} />}
        >
          <Route index element={<MapDiscovery />} />
          <Route path="discover" element={<Discover />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="shops" element={<SavedShops />} />
          <Route path="shop/:id" element={<ShopDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="*" element={<WorkspaceView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

export default App;