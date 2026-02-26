import React from 'react';

interface SharpSuccessBadgeProps {
  className?: string;
  pdfSafe?: boolean;
}

export const SharpSuccessBadge: React.FC<SharpSuccessBadgeProps> = ({ className, pdfSafe }) => {
  return (
    <div className={`relative flex items-center justify-center w-12 h-12 mb-6 ${!pdfSafe ? 'drop-shadow-md' : ''} ${className || ''}`}>
      <div 
        className="absolute w-10 h-10 bg-[#064e3b]" 
        style={{
          clipPath: "polygon(50% 0%, 61% 14%, 78% 9%, 82% 26%, 98% 30%, 91% 47%, 100% 63%, 85% 73%, 81% 91%, 64% 88%, 50% 100%, 36% 88%, 19% 91%, 15% 73%, 0% 63%, 9% 47%, 2% 30%, 18% 26%, 22% 9%, 39% 14%)"
        }}
      />
      
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`relative w-4 h-4 ${!pdfSafe ? 'drop-shadow-sm' : ''}`}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};

export default SharpSuccessBadge;
