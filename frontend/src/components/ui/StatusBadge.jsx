import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();
  let badgeStyle = "bg-muted text-muted-foreground";

  // Success / Active
  if (['ACTIVE', 'COMPLETED', 'VERIFIED', 'DELIVERED', 'APPROVED'].includes(normalizedStatus)) {
    badgeStyle = "bg-green-100 text-green-700";
  } 
  // Warning / Pending
  else if (['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(normalizedStatus)) {
    badgeStyle = "bg-blue-100 text-blue-800";
  } 
  // Destructive / Error
  else if (['CANCELLED', 'REJECTED', 'SUSPENDED', 'HIDDEN', 'LOW STOCK', 'OUT OF STOCK'].includes(normalizedStatus)) {
    badgeStyle = "bg-destructive/10 text-destructive";
  }
  // In Progress
  else if (['SHIPPED', 'OUT_FOR_DELIVERY'].includes(normalizedStatus)) {
    badgeStyle = "bg-primary/20 text-primary";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-center leading-tight whitespace-pre-wrap justify-center ${badgeStyle}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
