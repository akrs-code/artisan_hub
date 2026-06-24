import React, { useState, useMemo } from 'react';
import { Store, Ban, CheckCircle, RefreshCw, Eye, X, Trash2, Search } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import DataTable from '../../../components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';

// ── Role Badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
  <span className="badge-custom bg-primary/10 text-primary">
    {role}
  </span>
);

// ── User Detail Modal ─────────────────────────────────────────────────────────
const UserDetailModal = ({ user, shop, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-md z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-0.5">User Details</span>
            <h3 className="font-headline font-bold text-foreground text-base">{user.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-headline font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground font-sans mt-0.5">{user.subtext}</p>
              <div className="flex items-center gap-2 mt-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Joined</span>
              <span className="text-sm font-semibold text-foreground">{user.joinDate}</span>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Account Status</span>
              <span className={`text-sm font-bold uppercase ${user.status === 'SUSPENDED' ? 'text-destructive' : 'text-green-600'}`}>
                {user.status}
              </span>
            </div>
            {shop && (
              <>
                <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Store Name</span>
                  <span className="text-sm font-semibold text-foreground">{shop.name}</span>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Store Status</span>
                  <span className={`text-sm font-bold uppercase ${shop.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {shop.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-xl text-xs font-sans font-bold uppercase tracking-widest transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Table ────────────────────────────────────────────────────────────────
const UserDirectoryTable = ({ data, shops, onActionClick, onDeleteClick }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = data.filter(row => {
    const roleMatch = roleFilter === 'All' || row.role === roleFilter;
    const statusMatch = statusFilter === 'All' || row.status === statusFilter;
    const searchMatch = !searchQuery || row.name.toLowerCase().includes(searchQuery.toLowerCase()) || (row.subtext && row.subtext.toLowerCase().includes(searchQuery.toLowerCase()));
    return roleMatch && statusMatch && searchMatch;
  });

  const userShop = selectedUser
    ? shops?.find(s => s.owner?._id === selectedUser.id || s.owner === selectedUser.id)
    : null;

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm font-sans font-semibold text-foreground">{row.original.name}</div>
            <div className="text-[10px] font-sans text-primary">{row.original.subtext}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => <RoleBadge role={row.original.role} />
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      header: 'Joined',
      accessorKey: 'joinDate',
      cell: ({ row }) => <span className="text-sm font-sans text-muted-foreground">{row.original.joinDate}</span>
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: { headerClassName: 'text-right', cellClassName: 'flex items-center justify-end gap-3' },
      cell: ({ row }) => (
        <>
          <button
            onClick={() => setSelectedUser(row.original)}
            title="View Details"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.original.role === 'SELLER' && (
            <button
              onClick={() => onActionClick('View Shop', row.original)}
              title="View Shop"
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <Store className="w-4 h-4" />
            </button>
          )}
          {row.original.status === 'SUSPENDED' ? (
            <button
              onClick={() => onActionClick('Restore', row.original)}
              title="Restore Account"
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onActionClick('Suspend', row.original)}
              title="Suspend Account"
              className="text-destructive hover:text-destructive/70 transition-colors"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
          {row.original.role !== 'ADMIN' && (
            <button
              onClick={() => onDeleteClick?.(row.original)}
              title="Permanently Delete User"
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      )
    }
  ], [onActionClick, onDeleteClick]);

  return (
    <div className="w-full">
      <Tabs>
        <TabsList>
          {['All', 'BUYER', 'SELLER', 'ADMIN'].map(role => (
            <TabsTrigger 
              key={role} 
              active={roleFilter === role} 
              onClick={() => setRoleFilter(role)}
            >
              {role === 'All' ? 'All Users' : role} ({data.filter(r => role === 'All' || r.role === role).length})
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent active={true}>
          <DataTable
            title="User Directory"
            subtitle={`${filtered.length} of ${data.length} users`}
            columns={columns}
            data={filtered}
            emptyStateMessage="No users found."
            headerActions={
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-search rounded-full"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs font-sans font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {['All', 'VERIFIED', 'SUSPENDED'].map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                  ))}
                </select>
              </div>
            }
            footer={
              <div className="text-xs font-sans text-muted-foreground w-full">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
                <span className="font-semibold text-foreground">{data.length}</span> users
              </div>
            }
          />
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          shop={userShop}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserDirectoryTable;
