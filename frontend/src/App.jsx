import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { BuyerSidebar, SellerSidebar, AdminSidebar } from './components/RoleBasedSidebar';
import WorkspaceView from './components/WorkspaceView';
import Dashboard from './pages/seller/dashboard';
import Catalog from './pages/seller/catalog';
import Inventory from './pages/seller/inventory';
import Orders from './pages/seller/orders';
import Earnings from './pages/seller/earnings';
import Overview from './pages/admin/overview';
import Verify from './pages/admin/verify';
import Moderate from './pages/admin/moderate';
import Users from './pages/admin/users';


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<RootLayout sidebarContent={<AdminSidebar />} />}>
        <Route path="overview" element={<Overview />} />
        <Route path="verify" element={<Verify />} />
        <Route path="moderate" element={<Moderate />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="/seller/*" element={<RootLayout sidebarContent={<SellerSidebar />} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="earnings" element={<Earnings />} />
      </Route>

      <Route path="/*" element={<RootLayout sidebarContent={<BuyerSidebar />} />}>
        <Route path="*" element={<WorkspaceView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;