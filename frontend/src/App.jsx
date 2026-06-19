import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { BuyerSidebar, SellerSidebar, AdminSidebar } from './components/RoleBasedSidebar';
import WorkspaceView from './components/WorkspaceView';
import Overview from './pages/admin/overview';
import Verify from './pages/admin/verify';
import Moderate from './pages/admin/moderate';
import Users from './pages/admin/users';
import Logs from './pages/admin/logs';
import Disputes from './pages/admin/disputes';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<RootLayout sidebarContent={<AdminSidebar />} />} >
        <Route path="" element={<Overview />} />
        <Route path="verify" element={<Verify />} />
        <Route path="moderate" element={<Moderate />} />
        <Route path="users" element={<Users />} />
        <Route path="logs" element={<Logs />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="*" element={<WorkspaceView />} />
      </Route>

      <Route path="/seller/*" element={<RootLayout sidebarContent={<SellerSidebar />} />}>
        <Route path="*" element={<WorkspaceView />} />
      </Route>

      <Route path="/*" element={<RootLayout sidebarContent={<BuyerSidebar />} />}>
        <Route path="*" element={<WorkspaceView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;