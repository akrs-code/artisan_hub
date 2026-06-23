import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { StatusBadge } from '../../components/admin/common/StatusBadge';

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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-sans text-muted-foreground">Loading withdrawal requests...</p>
            </div>
        );
    }

    return (
        <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

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

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by shop or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-headline font-bold text-foreground">All Requests</h2>
                        <p className="text-xs font-sans text-muted-foreground mt-0.5">
                            {filteredWithdrawals.length} of {withdrawals.length} requests
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/40 border-b border-border">
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Requested On</th>
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Shop</th>
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Account Info</th>
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-5 py-3 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-muted-foreground text-sm font-sans">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredWithdrawals.map(w => (
                                    <tr key={w._id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-5 py-4 text-xs font-sans text-muted-foreground whitespace-nowrap">
                                            {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-headline font-semibold text-foreground">{w.shop?.name || 'Unknown Shop'}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-xs font-sans text-foreground font-semibold uppercase">{w.method}</p>
                                            <p className="text-[10px] font-sans text-muted-foreground">{w.accountName}</p>
                                            <p className="text-[10px] font-sans text-muted-foreground">{w.accountNumber}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-headline font-bold text-primary">
                                                {(w.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={normalizeStatus(w.status)} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {w.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(w._id, 'approved')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-sans font-semibold border border-primary/20 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(w._id, 'rejected')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-sans font-semibold border border-destructive/20 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {w.status === 'approved' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(w._id, 'completed')}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-sans font-semibold rounded-lg transition-colors shadow-sm"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredWithdrawals.length > 0 && (
                    <div className="p-4 border-t border-border bg-muted/20 text-xs font-sans text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filteredWithdrawals.length}</span> of{' '}
                        <span className="font-semibold text-foreground">{withdrawals.length}</span> requests
                    </div>
                )}
            </div>
        </div>
    );
};

export default Withdrawals;
