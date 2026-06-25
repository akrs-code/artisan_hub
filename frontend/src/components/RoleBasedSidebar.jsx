import { NavLink } from 'react-router-dom';
import {
  Map,
  ShoppingCart,
  Package,
  Heart,
  Store,
  LayoutDashboard,
  ShieldAlert,
  EyeOff,
  Scale,
  Users,
  FileText,
  FolderOpen,
  Truck,
  DollarSign,
  Compass,
  User
} from 'lucide-react';

const SidebarNavItem = ({
  to,
  label,
  icon: Icon,
  exact = false,
  indent = false,
}) => (
  <li>
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3 pr-4 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary group ${isActive
          ? 'bg-primary/10 text-primary border-l-4 border-primary pl-4 font-semibold'
          : `text-neutral-dark/80 hover:bg-neutral-dark/5 hover:text-neutral-dark border-l-4 border-transparent ${indent ? 'pl-8' : 'pl-5'
          }`
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive
                ? 'text-primary'
                : 'text-neutral-dark/60 group-hover:text-neutral-dark'
                }`}
              aria-hidden="true"
            />
          )}
          <span className="text-[13px]">{label}</span>
        </>
      )}
    </NavLink>
  </li>
);



export const BuyerSidebar = () => (
  <div className="flex flex-col pb-6">
    <ul className="flex flex-col">
      <SidebarNavItem
        to="/"
        exact
        label="Map"
        icon={Map}
      />
      <SidebarNavItem
        to="/discover"
        label="Discover"
        icon={Compass}
      />
      <SidebarNavItem
        to="/shops"
        label="Saved Shops & Products"
        icon={Heart}
      />
      <SidebarNavItem
        to="/cart"
        label="Shopping Cart"
        icon={ShoppingCart}
      />
      <SidebarNavItem
        to="/orders"
        label="Orders"
        icon={Package}
      />

    </ul>
  </div>
);

// --- Seller Sidebar ---

export const SellerSidebar = () => (
  <div className="flex flex-col pb-6 pt-4">
    <ul className="flex flex-col">
      <SidebarNavItem
        to="/seller/dashboard"
        exact
        label="Dashboard & Analytics"
        icon={LayoutDashboard}
      />
      <SidebarNavItem
        to="/seller/catalog"
        label="Product Catalog"
        icon={FolderOpen}
      />
      <SidebarNavItem
        to="/seller/inventory"
        label="Inventory Management"
        icon={Store}
      />
      <SidebarNavItem
        to="/seller/orders"
        label="Order Fulfillment"
        icon={Truck}
      />
      <SidebarNavItem
        to="/seller/earnings"
        label="Earnings & Payouts"
        icon={DollarSign}
      />

    </ul>
  </div>
);

// --- Admin Sidebar ---

export const AdminSidebar = () => (
  <div className="flex flex-col pb-6 pt-4">
    <ul className="flex flex-col">
      <SidebarNavItem
        to="/admin/overview"
        exact
        label="System Overview"
        icon={LayoutDashboard}
      />
      <SidebarNavItem
        to="/admin/verify"
        label="Verified Shops Queue"
        icon={ShieldAlert}
      />
      <SidebarNavItem
        to="/admin/moderate"
        label="Product Moderation"
        icon={EyeOff}
      />
      <SidebarNavItem
        to="/admin/users"
        label="User & Store Management"
        icon={Users}
      />
      <SidebarNavItem
        to="/admin/logs"
        label="Transaction Logs"
        icon={FileText}
      />
      <SidebarNavItem
        to="/admin/withdrawals"
        label="Payouts & Withdrawals"
        icon={DollarSign}
      />
    </ul>
  </div>
);