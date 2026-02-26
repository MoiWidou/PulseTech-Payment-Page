import React, { useRef } from 'react';
// import { useSearchParams } from "react-router-dom";
import { 
// Facebook, 
// Instagram, 
// Link2, 
Printer
} from 'lucide-react';

import { useNavigate, useParams } from "react-router-dom";
import SharpSuccessBadge from '../logos/sharpbadge';

import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

type redirectResponse = {
    transaction_id: string,
    currency: string,
    created_at: string,
    status: string,
    updated_at: string,
    reference_id: string,
    type: string,
    error: string | null,
    webhook_url: string | null,
    amount: number,
    fees: {
        system_fee: string,
        processing_fee: string,
    },
    paid_at: string | null,
    payment_method: {
        method_code: string | null,
        provider_code: string | null
    }
}

type ModalProps = {
  paymentSummary: redirectResponse | null;
  merchantName: string;
  paymentMethod: string;
};

const SuccessModal: React.FC<ModalProps>= ({paymentSummary, merchantName, paymentMethod}) => {
    
    const navigate              = useNavigate();
    const { merchant_username } = useParams();
    
    const receiptRef = useRef<HTMLDivElement>(null);

    if (!paymentSummary) return null;

    const totalAmount = (Number(paymentSummary?.amount)) + (Number(paymentSummary?.fees?.processing_fee)) + (Number(paymentSummary?.fees?.system_fee))

    const handleDownload = async () => {
        if (!receiptRef.current) return;

        try {
            const dataUrl = await toPng(receiptRef.current, {
            cacheBust: true,
            pixelRatio: 2, 
            backgroundColor: '#ffffff'
            });

            saveAs(dataUrl, `Receipt-${paymentSummary?.reference_id}.png`);
        } catch (err) {
            console.error('Failed to download receipt', err);
            alert('Could not generate receipt. Please try again.');
        }
    };

    return (
        /* UI Style Update: Background gradient changed to match Green scheme */
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#C9FCE9] p-2 font-sans mb-7">
        
        {/* Header Section */}
        <header className="flex flex-col items-center mb-4 pt-10">
            <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
            {/* UI Style Update: Text color from Purple to Dark Green */}
            <h2 className="text-[#064e3b] text-lg font-bold">{merchantName}</h2>
        </header>

        {/* Main Success Card */}
        <div 
            ref={receiptRef}
            id="receipt-section"
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-6 md:p-12 md:px-25 flex flex-col items-center text-center">
            
            {/* Success Badge */}
            <div className="relative mb-4 w-14 h-14">
                <SharpSuccessBadge className="w-full h-full"/>
            </div>

            {/* UI Style Update: Text color from Purple to Dark Green */}
            <h1 className="text-[#064e3b] text-xl md:text-lg font-bold mb-1">Payment Successful</h1>
            <p className="text-[#6F7282] text-xs md:text-sm sm leading-snug mb-4 max-w-100">
                Thank you for your payment. Your payment has been processed successfully.
            </p>

            {/* Details Table */}
            <div className="w-full bg-[#F9FAFB] rounded-tr-2xl rounded-tl-2xl border border-gray-100 p-4 shadow-lg">

                    <div className="space-y-2 mb-5 p-3">

                        {/* UI Style Update: Text color to Dark Green */}
                        <h3 className="text-center font-bold tracking-wider text-[#064e3b] mb-8">Payment Summary</h3>
                        
                        {/* UI Style Update: Row text colors to Dark Green */}
                        <div className="flex justify-between text-[#064e3b] text-xs">
                            <span>Sub Total</span>
                            <span className="font-medium">{(paymentSummary.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#064e3b] text-xs ">
                            <span>Processing Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.fees.processing_fee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#064e3b] text-xs ">
                            <span>System Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.fees.system_fee).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* UI Style Update: Border and Text color to Dark Green/Slate */}
                    <div className="flex justify-between items-center p-3 border-t border-dashed border-[#A0AEC0] pt-2 mx-3">
                        <span className="text-[#064e3b] font-bold">Amount Paid</span>
                        <span className="text-[#064e3b] font-bold">₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                
                    <div className=" border-[#A0AEC0] border-t border-dashed pt-2 mb-3 mx-3"/>

                    <div className="space-y-2 sm p-3 px-3 text-xs">
                        <div className="flex justify-between">
                        <span className="text-[#064e3b]">Reference No.</span>
                        <span className="text-[#064e3b] font-medium break-all ml-2">{paymentSummary.reference_id}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                        <span className="text-[#064e3b]">
                            Created at
                        </span>
                        <span className="text-[#064e3b] font-medium ml-2 break-all text-xs">
                            {new Date(paymentSummary.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            })}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-[#064e3b] text-xs">Payment Method</span>
                        <span className="text-[#064e3b] font-medium ml-2 whitespace-nowrap flex-shrink-0 text-xs">{paymentMethod}</span>
                        </div>
                    </div>  
            </div>


            {/* Security Footer */}
            <div className="bg-white border border-gray-100 rounded-bl-xl rounded-br-xl py-5 px-3 mb-4 shadow-lg w-full">
                <p className="text-[11px] text-[#6F7282]">
                {/* UI Style Update: Text Highlight to Dark Green */}
                Make sure the browser bar displays <span className="font-bold text-[#064e3b]">PulseTech</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:gap-10 w-full md:pt-10">
                <button
                    onClick={handleDownload} 
                    /* UI Style Update: Border/Text to Dark Green, Hover to Light Emerald */
                    className="flex w-[60%] md:w-full mx-auto items-center justify-center gap-1 border border-[#064e3b] text-[#064e3b] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg hover:bg-emerald-50 transition-colors sm text-xs">
                        <Printer size={14} />
                        Print Receipt
                </button>
                <button 
                        /* UI Style Update: Gradient to Dark Green/Emerald */
                        className="w-[60%] md:w-full mx-auto max-w-60 bg-[#202122] text-[#75EEA5] cursor-pointer hover:from-[#1B2A27] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                        onClick={() => navigate(`/${merchant_username}`)}
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