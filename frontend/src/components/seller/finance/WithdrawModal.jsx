import React, { useState, useEffect } from 'react';
import { X, Landmark, AlertCircle } from 'lucide-react';
import { walletAPI } from '../../../services/api';

const WithdrawModal = ({ isOpen, onClose, shopId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      setAmount('');
      setMethod('bank');
      setAccountName('');
      setAccountNumber('');
      setError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await walletAPI.requestWithdrawal(shopId, {
        amount: parseInt(amount, 10) * 100, 
        method,
        accountName,
        accountNumber
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to request withdrawal. Ensure you have enough balance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldInput = "field-input";
  const fieldLabel = "field-label";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <h3 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" />
            Request Payout
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-sans rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className={fieldLabel}>Amount (₱)</label>
            <input
              type="number"
              required
              min="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className={fieldInput}
            />
          </div>

          <div>
            <label className={fieldLabel}>Payout Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={fieldInput}
            >
              <option value="bank">Bank Transfer</option>
              <option value="gcash">GCash</option>
            </select>
          </div>

          <div>
            <label className={fieldLabel}>Account Name</label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Maria Santos"
              className={fieldInput}
            />
          </div>

          <div>
            <label className={fieldLabel}>Account Number</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 09123456789"
              className={fieldInput}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-lg btn-solid w-full"
            >
              {isSubmitting ? 'Processing...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
