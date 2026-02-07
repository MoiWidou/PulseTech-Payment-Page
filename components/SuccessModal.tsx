import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Link2, 
  Printer
} from 'lucide-react';

import { useLocation } from "react-router-dom";
import SharpSuccessBadge from './logos/sharpbadge';
import generateReference from './reference_generator/reference_generator';
import { useNavigate } from "react-router-dom";

const SuccessModal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentSummary } = location.state || {};

    if (!paymentSummary) return <p>No payment details available.</p>;

    // const { totalAmount, method, _subTotal, _processingFee, _systemFee } = paymentSummary;
    const { totalAmount, method} = paymentSummary;

    const paymentDetails = {
        amount: totalAmount,
        referenceNo: generateReference(paymentSummary.methodId),
        dateTime: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }),
        method: method
    };

    console.log(paymentSummary.methodId)
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

        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
            
            {/* Success Badge */}
            <div className="relative mb-4 w-14 h-14">
                <SharpSuccessBadge className="w-full h-full"/>
            </div>

            <h1 className="text-[#312B5B] text-xl md:text-lg font-bold mb-1">Payment Successful</h1>
            <p className="text-[#6F7282] text-xs leading-snug mb-4 max-w-60">
                Thank you for your payment. Your payment has been processed successfully.
            </p>

            {/* Details Table */}
            <div className="w-full bg-[#F4F6F8] rounded-tr-2xl rounded-tl-2xl border border-gray-100 p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[#312B5B] text-lg font-bold">You are sending</span>
                        <span className="text-[#312B5B] font-bold text-base">₱ {Number(paymentDetails.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                
                    <div className="border-t border-dashed border-[#6F7282] pt-2 mb-3"/>

                    <div className="text-xs">
                        <div className="flex justify-between my-8">
                        <span className="text-[#312B5B]">Reference No.</span>
                        <span className="text-[#312B5B] font-medium break-all ml-2">{paymentDetails.referenceNo}</span>
                        </div>
                        <div className="flex justify-between my-8">
                        <span className="text-[#312B5B]">Date & Time</span>
                        <span className="text-[#312B5B] font-medium ml-2">{paymentDetails.dateTime}</span>
                        </div>
                        <div className="flex justify-between my-8">
                        <span className="text-[#312B5B]">Payment Method</span>
                        <span className="text-[#312B5B] font-medium ml-2">{paymentDetails.method}</span>
                        </div>
                    </div>  
                </div>


            {/* Security Footer */}
            <div className="bg-white border border-gray-100 rounded-bl-xl rounded-br-xl py-2 px-3 mb-4 shadow-lg w-full">
                <p className="text-[9px] text-[#6F7282]">
                Make sure the browser bar displays <span className="font-bold text-[#312B5B]">PulseTech</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <button className="flex items-center justify-center gap-1 border border-gray-300 text-[#312B5B] font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-xs">
                <Printer size={14} />
                Print Receipt
                </button>
                <button 
                    className="bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:bg-[#0a4669] text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md text-xs"
                    onClick={ () => navigate ("/")}
                >
                
                    Make Another Payment
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default SuccessModal;


