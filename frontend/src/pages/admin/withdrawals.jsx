import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

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
            if (res?.data) {
                setWithdrawals(res.data);
            }
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200'; 
        }
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
                        className="pl-9 pr-4 py-2 bg-card border border-border/80 rounded-full text-xs font-sans focus:outline-none focus:border-primary/50 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/60">
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Requested On</th>
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Shop / Owner</th>
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Account Info</th>
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground text-xs font-sans">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredWithdrawals.map(w => (
                                    <tr key={w._id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-xs font-sans text-muted-foreground whitespace-nowrap">
                                            {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-headline font-bold text-foreground">{w.shop?.name || 'Unknown Shop'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-sans text-foreground font-bold uppercase">{w.method}</p>
                                            <p className="text-[10px] font-sans text-muted-foreground">{w.accountName}</p>
                                            <p className="text-[10px] font-sans text-muted-foreground">{w.accountNumber}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-headline font-bold text-primary">
                                                {(w.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(w.status)}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {w.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(w._id, 'approved')}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(w._id, 'rejected')}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {w.status === 'approved' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(w._id, 'completed')}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-sans font-bold uppercase tracking-widest rounded-lg transition-colors shadow-sm"
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
            </div>
        </div>
    );
};

export default Withdrawals;
