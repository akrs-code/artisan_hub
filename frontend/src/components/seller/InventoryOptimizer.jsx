import React from 'react';
import { Sparkles } from 'lucide-react';

const InventoryOptimizer = ({ title, description, buttonText, onOptimize }) => {
  return (
    <div className="bg-[#8C5233] text-white rounded-[1.75rem] p-8 flex flex-col h-full shadow-[0_10px_30px_-5px_rgba(140,82,51,0.2)]">
      <h3 className="text-[15px] font-sans font-bold mb-3">
        {title}
      </h3>
      <p className="text-[13px] font-sans text-white/80 leading-relaxed mb-auto">
        {description}
      </p>
      
      <button 
        onClick={onOptimize}
        className="mt-8 w-full bg-white text-[#8C5233] hover:bg-neutral-light hover:scale-[1.02] active:scale-[0.98] transition-all py-3 rounded-md flex items-center justify-center gap-2 text-[12px] font-bold tracking-widest uppercase shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        {buttonText}
      </button>
    </div>
  );
};

export default InventoryOptimizer;
