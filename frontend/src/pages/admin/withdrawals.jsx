import { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { StatusBadge } from '../../components/admin/common/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getWithdrawals();
            if (res?.data) setWithdrawals(res.data);
        } catch (error) {
            console.error('Failed to load withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminAPI.updateWithdrawalStatus(id, status, `Payout ${status} by admin`);
            fetchWithdrawals();
        } catch (error) {
            console.error(`Failed to mark withdrawal as ${status}:`, error);
        }
    };

    const filteredWithdrawals = withdrawals.filter(w =>
        w.shop?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.accountName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Map payout status to our unified badge vocabulary
    const normalizeStatus = (s) => {
        const map = { completed: 'COMPLETED', rejected: 'REJECTED', approved: 'APPROVED', pending: 'PENDING' };
        return map[s] || s.toUpperCase();
    };

    const columns = useMemo(() => [
        {
            header: 'Requested On',
            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <span className="text-xs font-sans text-muted-foreground whitespace-nowrap">
                    {new Date(row.original.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Shop',
            accessorKey: 'shop',
            cell: ({ row }) => (
                <p className="text-sm font-headline font-semibold text-foreground">{row.original.shop?.name || 'Unknown Shop'}</p>
            )
        },
        {
            header: 'Account Info',
            accessorKey: 'accountName',
            cell: ({ row }) => (
                <div>
                    <p className="text-xs font-sans text-foreground font-semibold uppercase">{row.original.method}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{row.original.accountName}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{row.original.accountNumber}</p>
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }) => (
                <p className="text-sm font-headline font-bold text-primary">
                    {(row.original.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                </p>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <StatusBadge status={normalizeStatus(row.original.status)} />
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
            cell: ({ row }) => {
                const w = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        {w.status === 'pending' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(w._id, 'approved')}
                                    className="text-primary hover:text-primary"
                                    title="Approve"
                                >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(w._id, 'rejected')}
                                    title="Reject"
                                >
                                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Reject
                                </Button>
                            </>
                        )}
                        {w.status === 'approved' && (
                            <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(w._id, 'completed')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Mark Paid
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ], [handleUpdateStatus]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-sans text-muted-foreground">Loading withdrawal requests...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight mb-1">
                        Payout Requests
                    </h1>
                    <p className="text-muted-foreground font-sans text-xs">
                        Review, approve, and process seller withdrawal requests.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <DataTable
                    title="All Requests"
                    subtitle={`${filteredWithdrawals.length} of ${withdrawals.length} requests`}
                    columns={columns}
                    data={filteredWithdrawals}
                    emptyStateMessage="No withdrawal requests found."
                    headerActions={
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search by shop or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-full"
                            />
                        </div>
                    }
                    footer={
                        filteredWithdrawals.length > 0 && (
                            <div className="text-xs font-sans text-muted-foreground w-full">
                                Showing <span className="font-semibold text-foreground">{filteredWithdrawals.length}</span> of{' '}
                                <span className="font-semibold text-foreground">{withdrawals.length}</span> requests
                            </div>
                        )
                    }
                />
            </div>
        </div>
    );
};

export default Withdrawals;
