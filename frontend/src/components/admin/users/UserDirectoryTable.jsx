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
const UserDetailModal = ({ user, shop, onClose, onActionClick, onDeleteClick }) => {
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
        <div className="px-6 py-4 border-t border-border flex flex-col gap-2">
          {user.role === 'SELLER' && (
            <button onClick={() => { onActionClick('View Shop', user); onClose(); }} className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest">
              View Shop
            </button>
          )}
          {user.status === 'SUSPENDED' ? (
            <button onClick={() => { onActionClick('Restore', user); onClose(); }} className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-bold uppercase tracking-widest">
              Restore Account
            </button>
          ) : (
            <button onClick={() => { onActionClick('Suspend', user); onClose(); }} className="w-full py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-xl text-xs font-bold uppercase tracking-widest">
              Suspend Account
            </button>
          )}
          {user.role !== 'ADMIN' && (
            <button onClick={() => { onDeleteClick?.(user); onClose(); }} className="w-full py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-xl text-xs font-bold uppercase tracking-widest">
              Permanently Delete User
            </button>
          )}
          <button onClick={onClose} className="w-full py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-xl text-xs font-bold uppercase tracking-widest mt-2">
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

  const filtered = data.filter(row => {
    const roleMatch = roleFilter === 'All' || row.role === roleFilter;
    const statusMatch = statusFilter === 'All' || row.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const userShop = selectedUser
    ? shops?.find(s => s.owner?._id === selectedUser.id || s.owner === selectedUser.id)
    : null;

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans font-bold text-foreground leading-tight block">
          {row.original.name}
        </span>
      )
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row }) => (
        <span className="text-[12px] font-sans text-muted-foreground leading-tight block">
          {row.original.email || row.original.subtext || '—'}
        </span>
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
      cell: ({ row }) => <span className="text-[12px] font-sans text-muted-foreground leading-tight block">{row.original.joinDate}</span>
    },
    {
      header: 'Actions',
      id: 'actions',
      meta: { headerClassName: 'text-center', cellClassName: 'flex items-center justify-center gap-3' },
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedUser(row.original)}
          title="View Details"
          className="text-muted-foreground hover:text-primary transition-colors p-1"
        >
          <Eye className="w-4 h-4" />
        </button>
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
          onActionClick={onActionClick}
          onDeleteClick={onDeleteClick}
        />
      )}
    </div>
  );
};

export default UserDirectoryTable;
