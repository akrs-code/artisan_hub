import React, { useState, useEffect } from 'react';
import { Landmark, AlertCircle } from 'lucide-react';
import { walletAPI } from '../../../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

const WithdrawModal = ({ isOpen, onClose, shopId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setMethod('bank');
      setAccountName('');
      setAccountNumber('');
      setError('');
    }
  }, [isOpen]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClick={onClose} />
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary" />
            Request Payout
          </DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;

