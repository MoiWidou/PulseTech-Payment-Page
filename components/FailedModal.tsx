import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Link2, 
  XCircle 
} from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const FailedModal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentSummary } = location.state || {};

    if (!paymentSummary) return <p className="text-center mt-10 text-[#312B5B]">No payment details available.</p>;

    const { totalAmount } = paymentSummary;

    const formattedDate = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#F3E8FF] via-[#E9D5FF] to-[#D8B4FE] p-2 font-sans">
        
            {/* Header Section */}
            <div className="flex flex-col items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 shadow-inner" />
                <h2 className="text-[#312B5B] text-lg font-bold">Business Name</h2>
                <div className="flex gap-2 mt-1 text-[#312B5B]">
                    <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                </div>
            </div>

            {/* Main Failed Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 md:p-10 flex flex-col items-center text-center">
                
                    {/* Failed Icon */}
                    <div className="mb-4">
                        <XCircle 
                            size={56} 
                            color="#E5484D"   
                            strokeWidth={2.5} 
                            />
                    </div>

                    {/* Header */}
                    <h1 className="text-[#312B5B] text-xl md:text-2xl font-bold mb-1">Payment Failed</h1>
                    
                    {/* Instructional Text */}
                    <p className="text-[#6F7282] text-xs md:text-sm leading-snug mb-8">
                        We couldn't process your payment at this time.
                    </p>

                    {/* Amount Display */}
                    <div className="mb-8">
                        <p className="text-xs md:text-sm text-[#312B5B]">
                            Your payment to <span className="text-[#007AFF] font-medium cursor-pointer">Business Name</span>
                        </p>
                        <h2 className="text-3xl font-bold text-[#312B5B] my-1">
                            ₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <p className="text-xs md:text-sm text-[#312B5B]">was not completed.</p>
                    </div>

                    {/* Status Info */}
                    <div className="mb-8">
                        <p className="text-[#6F7282] text-xs mb-1">{formattedDate}</p>
                        <p className="text-[#312B5B] text-xs md:text-sm max-w-70 leading-relaxed">
                            Please try again or choose a different payment method.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full flex justify-center">
                        <button 
                            className="w-full max-w-60 bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
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

export default FailedModal;
