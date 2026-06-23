import React, { useState } from 'react';
import { Store, Ban, CheckCircle, RefreshCw, Eye, X, Trash2 } from 'lucide-react';

const RoleBadge = ({ role }) => (
  <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-bold tracking-widest uppercase">
    {role}
  </span>
);

const StatusDisplay = ({ status }) => {
  let colorClass = 'bg-primary text-primary';
  if (status === 'SUSPENDED') colorClass = 'bg-destructive text-destructive';

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[0]}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${colorClass.split(' ')[1]}`}>
        {status}
      </span>
    </div>
  );
};


const UserDetailModal = ({ user, shop, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <span className="text-[9px] font-sans font-bold text-primary uppercase tracking-widest block mb-0.5">User Details</span>
            <h3 className="font-headline font-bold text-foreground text-lg">{user.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-xl object-cover border border-border" />
            <div>
              <p className="font-headline font-bold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground font-sans">{user.subtext}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <RoleBadge role={user.role} />
                <StatusDisplay status={user.status} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Joined</span>
              <span className="font-semibold text-foreground">{user.joinDate}</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Account Status</span>
              <span className={`font-bold uppercase ${user.status === 'SUSPENDED' ? 'text-destructive' : 'text-green-600'}`}>
                {user.status}
              </span>
            </div>
            {shop && (
              <>
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Store Name</span>
                  <span className="font-semibold text-foreground">{shop.name}</span>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Store Status</span>
                  <span className={`font-bold uppercase ${shop.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {shop.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border">
          <button onClick={onClose} className="w-full py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-xl text-xs font-sans font-bold uppercase tracking-widest transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      {/* Header with live filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-border gap-4">
        <h2 className="text-base font-headline font-bold text-foreground">User Directory</h2>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            {['All', 'BUYER', 'SELLER', 'ADMIN'].map(r => (
              <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            {['All', 'VERIFIED', 'SUSPENDED'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Name</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Role</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Status</th>
              <th className="py-3 px-4 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase">Joined</th>
              <th className="py-3 px-5 text-[10px] font-sans font-bold tracking-widest text-muted-foreground uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm font-sans text-muted-foreground">No users found.</td>
              </tr>
            ) : filtered.map((row, i) => (
              <tr key={row.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div>
                      <div className="text-[13px] font-sans font-bold text-foreground">{row.name}</div>
                      <div className="text-[9px] font-sans text-primary uppercase tracking-wider">{row.subtext}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4"><RoleBadge role={row.role} /></td>
                <td className="py-4 px-4"><StatusDisplay status={row.status} /></td>
                <td className="py-4 px-4 text-[13px] font-sans text-muted-foreground">{row.joinDate}</td>
                <td className="py-4 px-5">
                  <div className="flex items-center justify-end gap-3">
                    {/* View Details */}
                    <button
                      onClick={() => setSelectedUser(row)}
                      title="View Details"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* View Shop (sellers only) */}
                    {row.role === 'SELLER' && (
                      <button
                        onClick={() => onActionClick('View Shop', row)}
                        title="View Shop"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Store className="w-4 h-4" />
                      </button>
                    )}

                    {/* Suspend / Restore */}
                    {row.status === 'SUSPENDED' ? (
                      <button
                        onClick={() => onActionClick('Restore', row)}
                        title="Restore Account"
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActionClick('Suspend', row)}
                        title="Suspend Account"
                        className="text-destructive hover:text-red-700 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete (not available for admin accounts) */}
                    {row.role !== 'ADMIN' && (
                      <button
                        onClick={() => onDeleteClick?.(row)}
                        title="Permanently Delete User"
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-muted/20 text-[11px] font-sans text-muted-foreground">
        Showing <span className="font-bold text-foreground">{filtered.length}</span> of <span className="font-bold text-foreground">{data.length}</span> users
      </div>

      {/* User Detail Modal */}
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
