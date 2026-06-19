import React from 'react';
import { ChevronDown, Pencil, Store, Ban, CheckCircle, RefreshCw } from 'lucide-react';
import Pagination from './Pagination';

const RoleBadge = ({ role }) => {
  return (
    <span className="inline-flex px-3 py-1 rounded-full bg-[#EBE5D9] text-[#8C5233] text-[9px] font-bold tracking-widest uppercase">
      {role}
    </span>
  );
};

const StatusDisplay = ({ status }) => {
  let colorClass = "bg-primary text-primary";
  if (status === 'PENDING') colorClass = "bg-[#D97706] text-[#D97706]";
  if (status === 'SUSPENDED') colorClass = "bg-destructive text-destructive";

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[0]}`}></div>
      <span className={`text-[10px] font-bold tracking-widest uppercase ${colorClass.split(' ')[1]}`}>
        {status}
      </span>
    </div>
  );
};

const UserDirectoryTable = ({ data, onFilterClick, onActionClick }) => {
  return (
    <div className="card-custom !p-0 overflow-hidden flex flex-col h-full group hover:card-custom-hover">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-neutral-dark/10 gap-4">
        <h2 className="text-lg font-headline font-bold text-neutral-dark">Directory</h2>
        <div className="flex items-center gap-4 text-neutral-dark/60">
          <button
            onClick={() => onFilterClick('Role')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            ALL ROLES
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <button
            onClick={() => onFilterClick('Status')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-dark/10 bg-neutral-dark/5 hover:bg-neutral-dark/10 text-[11px] font-sans font-bold text-neutral-dark transition-colors uppercase tracking-wider"
          >
            STATUS: ALL
            <ChevronDown className="w-3 h-3 text-neutral-dark/50" />
          </button>
          <div className="w-px h-5 bg-neutral-dark/10 mx-2"></div>
          <span className="text-[11px] font-sans text-neutral-dark/60">
            1-10 of 24,892
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-neutral-dark/5 border-b border-neutral-dark/10">
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Name / Shop</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Role</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Status</th>
              <th className="py-4 px-4 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase">Join Date</th>
              <th className="py-4 px-6 text-[10px] font-sans font-bold tracking-widest text-neutral-dark/60 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-neutral-dark/5 hover:bg-neutral-dark/5 transition-colors group/row ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="py-5 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-dark/10">
                    <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[13px] font-sans font-bold text-neutral-dark mb-0.5">
                      {row.name}
                    </div>
                    <div className="text-[9px] font-sans text-[#8C5233] uppercase tracking-wider">
                      {row.subtext}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <RoleBadge role={row.role} />
                </td>
                <td className="py-5 px-4">
                  <StatusDisplay status={row.status} />
                </td>
                <td className="py-5 px-4 text-[13px] font-sans text-neutral-dark/60 font-medium">
                  {row.joinDate}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-end gap-5">
                    {/* Common Edit Action */}
                    <button
                      onClick={() => onActionClick('Edit', row.name)}
                      className="text-neutral-dark/40 hover:text-neutral-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Role-specific Action */}
                    {row.role === 'SELLER' ? (
                      <button
                        onClick={() => onActionClick('View Shop', row.name)}
                        className="text-[#8C5233] hover:text-[#7E4A2E] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        <Store className="w-4 h-4" />
                      </button>
                    ) : row.status === 'PENDING' ? (
                      <button
                        onClick={() => onActionClick('Approve', row.name)}
                        className="text-primary hover:text-primary-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-4 h-4" /> /* Spacer if no action */
                    )}

                    {/* Status-specific Action (Suspend / Restore) */}
                    {row.status === 'SUSPENDED' ? (
                      <button
                        onClick={() => onActionClick('Restore', row.name)}
                        className="text-primary hover:text-primary-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActionClick('Suspend', row.name)}
                        className="text-destructive hover:text-red-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-neutral-dark/10 p-4 px-6 flex items-center justify-between bg-neutral-dark/5">
        <div className="text-[11px] font-sans text-neutral-dark/60">
          Showing <span className="font-bold text-neutral-dark">1</span> to <span className="font-bold text-neutral-dark">10</span> of <span className="font-bold text-neutral-dark">24,892</span> users
        </div>
        <div className="scale-90 origin-right">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default UserDirectoryTable;
