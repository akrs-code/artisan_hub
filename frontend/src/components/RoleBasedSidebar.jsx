import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Map, ShoppingCart, Package, Heart,
  Store, LayoutDashboard, ShieldAlert, EyeOff, Scale,
  Users, FileText, FolderOpen,
  Truck, DollarSign,
} from 'lucide-react';

const SidebarNavItem = ({ to, label, icon: Icon, exact = false, indent = false }) => (
  <li>
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3 pr-4 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary group ${isActive
          ? 'bg-primary/10 text-primary border-l-4 border-primary pl-4 font-semibold'
          : `text-neutral-dark/80 hover:bg-neutral-dark/5 hover:text-neutral-dark border-l-4 border-transparent ${indent ? 'pl-8' : 'pl-5'}`
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-primary' : 'text-neutral-dark/60 group-hover:text-neutral-dark'}`}
              aria-hidden="true"
            />
          )}
          <span className="text-[13px]">{label}</span>
        </>
      )}
    </NavLink>
  </li>
);

const SidebarSectionHeader = ({ title }) => (
  <h2 className="text-[10px] font-extrabold tracking-widest text-neutral-dark/90 mt-6 mb-2 uppercase px-5 font-sans">
    {title}
  </h2>
);

const FeaturedShopItem = ({ to, name, category }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col py-2.5 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary group ${isActive
          ? 'bg-primary/10 border-l-4 border-primary pl-4'
          : 'border-l-4 border-transparent pl-5 hover:bg-neutral-dark/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-[13px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-neutral-dark/90'}`}>
            {name}
          </span>
          <span className="text-[10px] text-neutral-dark/50">{category}</span>
        </>
      )}
    </NavLink>
  </li>
);


const featuredShops = [
  { to: '/shop/iron-loom', name: 'The Iron Loom', category: 'Textiles' },
  { to: '/shop/maranao', name: 'Maranao Woodworks', category: 'Woodwork' },
  { to: '/shop/whang-od', name: 'Apo Whang-Od Tattoos', category: 'Woven Crafts' },
];


export const BuyerSidebar = () => (
  <div className="flex flex-col pb-6">
    <ul className="flex flex-col">
      <SidebarNavItem to="/" exact label="Map/Discovery" icon={Map} />
      <SidebarNavItem to="/shops" label="Saved Shops" icon={Heart} />
      <SidebarNavItem to="/cart" label="Shopping Cart" icon={ShoppingCart} />
      <SidebarNavItem to="/orders" label="Orders" icon={Package} />
    </ul>

    <SidebarSectionHeader title="CATEGORIES" />
    <ul className="flex flex-col">
      <SidebarNavItem to="/category/woodwork" label="Woodwork" indent />
      <SidebarNavItem to="/category/percussion" label="Percussion" indent />
      <SidebarNavItem to="/category/textiles" label="Textiles" indent />
      <SidebarNavItem to="/category/woven" label="Woven Crafts" indent />
    </ul>

    <SidebarSectionHeader title="FEATURED SHOPS" />
    <ul className="flex flex-col">
      {featuredShops.map((shop) => (
        <FeaturedShopItem key={shop.to} {...shop} />
      ))}
    </ul>
  </div>
);

// --- Seller Sidebar ---

export const SellerSidebar = () => (
  <div className="flex flex-col pb-6 pt-4">
    <ul className="flex flex-col">
      <SidebarNavItem to="/seller/dashboard" exact label="Dashboard & Analytics" icon={LayoutDashboard} />
      <SidebarNavItem to="/seller/catalog" label="Product Catalog" icon={FolderOpen} />
      <SidebarNavItem to="/seller/inventory" label="Inventory Management" icon={Store} />
      <SidebarNavItem to="/seller/fulfillment" label="Order Fulfilment" icon={Truck} />
      <SidebarNavItem to="/seller/earnings" label="Earnings & Payouts" icon={DollarSign} />
    </ul>
  </div>
);

// --- Admin Sidebar ---

export const AdminSidebar = () => (
  <div className="flex flex-col pb-6 pt-4">
    <ul className="flex flex-col">
      <SidebarNavItem to="/admin" exact label="System Overview" icon={LayoutDashboard} />
      <SidebarNavItem to="/admin/verify" label="Verified Shops Queue" icon={ShieldAlert} />
      <SidebarNavItem to="/admin/moderate" label="Product Moderation" icon={EyeOff} />
      <SidebarNavItem to="/admin/users" label="User & Store Management" icon={Users} />
      <SidebarNavItem to="/admin/logs" label="Transaction Logs" icon={FileText} />
      <SidebarNavItem to="/admin/disputes" label="Disputes & Complaints" icon={Scale} />
    </ul>
  </div>
);
