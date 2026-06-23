import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import {
  BuyerSidebar,
  SellerSidebar,
  AdminSidebar,
} from './components/RoleBasedSidebar';
import WorkspaceView from './components/WorkspaceView';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { GuestRoute, ProtectedRoute, SellerRoute } from './components/RouteGuards';


import Login from './pages/shared/Login';
import Signup from './pages/shared/Signup';
import SellerVerification from './pages/shared/SellerVerification';



import MapDiscovery from './pages/buyer/MapDiscovery';
import Discover from './pages/buyer/Discover';
import SavedShops from './pages/buyer/SavedShops';
import ShopDetail from './pages/buyer/ShopDetail';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Orders from './pages/buyer/Orders';
import BuyerProfile from './pages/buyer/BuyerProfile';
import PaymentSuccess from './pages/buyer/PaymentSuccess';


import Dashboard from './pages/seller/dashboard';
import Catalog from './pages/seller/catalog';
import Inventory from './pages/seller/inventory';
import SellerOrders from './pages/seller/orders';
import Earnings from './pages/seller/earnings';


import Overview from './pages/admin/overview';
import Verify from './pages/admin/verify';
import Moderate from './pages/admin/moderate';
import Users from './pages/admin/users';
import Logs from './pages/admin/logs';
import Withdrawals from './pages/admin/withdrawals';

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Route>
          
          <Route path="/verify-seller" element={<SellerVerification />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route
              path="/admin/*"
              element={<RootLayout sidebarContent={<AdminSidebar />} />}
            >
              <Route path="overview" element={<Overview />} />
              <Route path="verify" element={<Verify />} />
              <Route path="moderate" element={<Moderate />} />
              <Route path="users" element={<Users />} />
              <Route path="logs" element={<Logs />} />
              <Route path="withdrawals" element={<Withdrawals />} />
              <Route path="*" element={<WorkspaceView />} />
            </Route>
          </Route>

          <Route element={<SellerRoute />}>
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
          </Route>

          {/* Public & Private Buyer Routes */}
          <Route
            path="/*"
            element={<RootLayout sidebarContent={<BuyerSidebar />} />}
          >
            {/* Public Buyer Routes */}
            <Route index element={<MapDiscovery />} />
            <Route path="discover" element={<Discover />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="shop/:id" element={<ShopDetail />} />
            <Route path="cart" element={<Cart />} />

            {/* Authenticated Buyer Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="profile" element={<BuyerProfile />} />
              <Route path="shops" element={<SavedShops />} />

              <Route path="success" element={<PaymentSuccess />} />
            </Route>

            <Route path="*" element={<WorkspaceView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;