import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { BuyerSidebar, SellerSidebar, AdminSidebar } from './components/RoleBasedSidebar';
import MapDiscovery from './pages/buyer/MapDiscovery';
import WorkspaceView from './components/WorkspaceView';

// Buyer Pages
import SavedShops from './pages/buyer/SavedShops';
import ShopDetail from './pages/buyer/ShopDetail';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Orders from './pages/buyer/Orders';
import { CartProvider } from './context/CartContext';

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<RootLayout sidebarContent={<AdminSidebar />} />}>
          <Route path="*" element={<WorkspaceView />} />
        </Route>

        <Route path="/seller/*" element={<RootLayout sidebarContent={<SellerSidebar />} />}>
          <Route path="*" element={<WorkspaceView />} />
        </Route>

        <Route path="/*" element={<RootLayout sidebarContent={<BuyerSidebar />} />}>
          <Route index element={<MapDiscovery />} />
          <Route path="shops" element={<SavedShops />} />
          <Route path="shop/:id" element={<ShopDetail />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="*" element={<WorkspaceView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

export default App;