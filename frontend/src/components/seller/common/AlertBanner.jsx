import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AlertBanner = ({ title, message, buttonText, onClick, variant = 'danger', icon: Icon = TriangleAlert }) => {
  const alertVariant = variant === 'danger' ? 'destructive' : 'warning';
  
  const buttonClass = alertVariant === 'destructive' 
    ? "bg-[#C85746] hover:bg-destructive text-white" 
    : "btn-md btn-solid";

  return (
    <Alert variant={alertVariant} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full p-5 [&>svg]:relative [&>svg]:left-0 [&>svg]:top-0 [&>svg~div]:pl-0">
      <div className="flex items-start gap-4">
        <Icon className="w-5 h-5 shrink-0" />
        <div>
          <AlertTitle className="text-[13px] font-sans font-bold text-neutral-dark mb-1">
            {title}
          </AlertTitle>
          <AlertDescription className="text-[13px] font-sans text-neutral-dark/70">
            {message}
          </AlertDescription>
        </div>
      </div>
      {buttonText && onClick && (
        <button 
          onClick={onClick}
          className={`shrink-0 px-5 py-2.5 rounded-md text-[11px] font-bold tracking-widest uppercase transition-colors ${buttonClass}`}
        >
          {buttonText}
        </button>
      )}
    </Alert>
  );
};

export default AlertBanner;

