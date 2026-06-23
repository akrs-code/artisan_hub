import React, { useState, useEffect } from 'react';
import { Users, Store, Ban, UserPlus, Loader2 } from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import UserDirectoryTable from '../../components/admin/UserDirectoryTable';
import { adminAPI } from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [usersRes, shopsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getShops()
      ]);
      setUsers(usersRes?.data || []);
      setShops(shopsRes?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load user records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleActionClick = async (actionName, row) => {
    if (actionName === 'Suspend' || actionName === 'Restore') {
      if (!window.confirm(`Are you sure you want to ${actionName.toLowerCase()} ${row.name}?`)) return;
      try {
        await adminAPI.toggleUser(row.id);
        const usersRes = await adminAPI.getUsers();
        setUsers(usersRes?.data || []);
      } catch (err) {
        alert(err.message || 'Failed to update user status.');
      }
    } else if (actionName === 'View Shop') {
      const userShop = shops.find(s => s.owner?._id === row.id || s.owner === row.id);
      if (!userShop) { alert('No shop associated with this seller.'); }
    }
  };

  const handleDeleteUser = async (row) => {
    if (!window.confirm(`⚠️ This will permanently delete "${row.name}" and all their data. This cannot be undone. Continue?`)) return;
    try {
      await adminAPI.deleteUser(row.id);
      const usersRes = await adminAPI.getUsers();
      setUsers(usersRes?.data || []);
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const directory = users.map(user => {
    const isSeller = user.role === 'seller';
    const shopOfUser = isSeller ? shops.find(s => s.owner?._id === user._id) : null;
    return {
      id: user._id,
      name: user.name,
      subtext: shopOfUser ? shopOfUser.name.toUpperCase() : user.email,
      avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EBE5D9&color=8C5233&size=128`,
      role: user.role.toUpperCase(),
      status: user.isActive ? 'VERIFIED' : 'SUSPENDED',
      joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  });

  const totalUsersCount = users.length;
  const activeShopsCount = shops.filter(s => s.isActive).length;
  const suspendedCount = users.filter(u => !u.isActive).length;
  const newRegCount = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-sans text-muted-foreground">Loading directory...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
            User & Store Management
          </h1>
          <p className="text-muted-foreground font-sans text-xs">
            Oversee Artisan Hub's ecosystem of creators and customers.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-sans">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard 
          title="Total Users" 
          value={totalUsersCount} 
          subtext={
            <span className="flex items-center gap-1 text-[#8C5233] font-bold text-xs">
              System Record
            </span>
          }
          icon={Users}
        />
        <AdminStatCard 
          title="Active Shops" 
          value={activeShopsCount} 
          subtext="Map Pins Active"
          icon={Store}
        />
        <AdminStatCard 
          title="Suspended" 
          value={suspendedCount} 
          subtext={
            <span className="text-destructive font-bold text-xs">
              Immediate Action
            </span>
          }
          icon={Ban}
        />
        <AdminStatCard 
          title="New Registrations" 
          value={newRegCount} 
          subtext={
            <span className="text-[#8C5233] font-bold tracking-widest text-[9px] uppercase">
              LAST 24H
            </span>
          }
          icon={UserPlus}
        />
      </div>

      {/* Main Table Content */}
      <div className="w-full mb-8">
        <UserDirectoryTable
          data={directory}
          shops={shops}
          onActionClick={handleActionClick}
          onDeleteClick={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default UsersPage;