import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { BuyerSidebar, SellerSidebar, AdminSidebar } from './components/RoleBasedSidebar';
import MapDiscovery from './pages/MapDiscovery';
import WorkspaceView from './components/WorkspaceView';

const App = () => (
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
        <Route path="*" element={<WorkspaceView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;