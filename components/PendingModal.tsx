import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Link2, 
  MoreHorizontal 
} from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const PendingModal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentSummary } = location.state || {};

    // Fallback if no state is passed
    if (!paymentSummary) return <p className="text-center mt-10">No payment details available.</p>;

    const { totalAmount } = paymentSummary;

    const formattedDate = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6] p-2 font-sans">
        
            {/* Header Section */}
            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-2 shadow-inner" />
                <h2 className="text-[#312B5B] text-lg font-bold">Business Name</h2>
                <div className="flex gap-2 mt-1 text-[#312B5B]">
                    <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                </div>
            </div>

            {/* Main Pending Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 md:p-10 flex flex-col items-center text-center">
                
                    {/* Pending Icon (Yellow circle with white dots) */}
                    <div className="mb-6 flex items-center justify-center w-14 h-14 bg-[#D4AF37] rounded-full shadow-sm animate-pulse">
                        <MoreHorizontal size={32} color="white" strokeWidth={3} />
                    </div>

                    <h1 className="text-black text-2xl font-bold mb-1">Pending...</h1>
                    
                    <div className="text-[#312B5B] opacity-90 text-xs md:text-sm leading-snug mb-10 max-w-xs">
                        <p>Thank you for your payment request.</p>
                        <p>Your transaction is currently pending and is being processed.</p>
                    </div>

                    {/* Central Amount Display */}
                    <div className="mb-10">
                        <p className="text-xs md:text-sm text-[#312B5B]">
                            You have initiated a payment to
                        </p>
                        <p className="text-[#007AFF] font-medium text-xs md:text-sm cursor-pointer">
                            Business Name
                        </p>
                        <h2 className="text-4xl font-bold text-black my-2">
                            ₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>

                    {/* Date Display */}
                    <div className="mb-8">
                        <p className="text-[#6F7282] text-sm font-medium">{formattedDate}</p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full flex justify-center">
                        <button 
                            className="w-full max-w-[240px] bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                            onClick={() => navigate("/")}
                        >
                            Make Another Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingModal;