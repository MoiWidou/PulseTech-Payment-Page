import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";
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
const SuccessModal: React.FC = () => {

    const api_base_url = import.meta.env.VITE_API_BASE_URL

    const navigate = useNavigate();
    const { merchant_username }                = useParams();
    const [searchParams]                       = useSearchParams();
    const reference_id                         = searchParams.get("reference_id");
    const [ _loading, setLoading ]             = useState(false);
    const [ _error, setError ]                 = useState<string | null>(null);
    const [ paymentSummary, setPaymentSummary] = useState <redirectResponse | null > (null);
    
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!merchant_username || !reference_id) return;

        const fetchPaymentStatus = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${api_base_url}/payment-page/${merchant_username}/payment/${reference_id}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to verify payment");
                }

                const data = await response.json();
                setPaymentSummary(data);
                console.log("Verification response:", data);

            } catch (err: unknown) {
                console.error(err);

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };
            fetchPaymentStatus();
    }, [merchant_username, reference_id]);

    if (!paymentSummary) return <p>No payment details available.</p>

    const totalAmount = (paymentSummary.amount ?? 0) + Number(paymentSummary.fees?.processing_fee ?? 0) + Number(paymentSummary.fees?.system_fee ?? 0)

    const handleDownload = async () => {
        if (!receiptRef.current) return;

        try {
            // Capture the receipt as PNG
            const dataUrl = await toPng(receiptRef.current, {
            cacheBust: true,
            pixelRatio: 2, // better quality
            backgroundColor: '#ffffff'
            });

            // Trigger automatic download
            saveAs(dataUrl, `Receipt-${paymentSummary?.reference_id}.png`);
        } catch (err) {
            console.error('Failed to download receipt', err);
            alert('Could not generate receipt. Please try again.');
        }
    };

    


    // console.log(paymentSummary.methodId)
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6] p-2 font-sans">
        
        {/* Header Section */}
        <header className="flex flex-col items-center mb-4 pt-10">
            <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
            <h2 className="text-[#312B5B] text-lg font-bold">Merchant Name Placeholder</h2>
            <div className="flex gap-2 mt-1 text-[#312B5B]">
            {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
            </div>
        </header>

        {/* Main Success Card */}
        <div 
            ref={receiptRef}
            id="receipt-section"
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-6 md:p-12 md:px-25 flex flex-col items-center text-center">
            
            {/* Success Badge */}
            <div className="relative mb-4 w-14 h-14">
                <SharpSuccessBadge className="w-full h-full"/>
            </div>

            <h1 className="text-[#312B5B] text-xl md:text-lg font-bold mb-1">Payment Successful</h1>
            <p className="text-[#6F7282] text-xs md:text-sm sm leading-snug mb-4 max-w-100">
                Thank you for your payment. Your payment has been processed successfully.
            </p>

            {/* Details Table */}
            <div className="w-full bg-[#F4F6F8] rounded-tr-2xl rounded-tl-2xl border border-gray-100 p-4 shadow-lg">

                    <div className="space-y-2 mb-5 p-3">

                        <h3 className="text-center font-bold tracking-wider text-[#312B5B] mb-8 text-lg">Payment Summary</h3>
                        
                        <div className="flex justify-between text-[#312B5B] md:text-base">
                            <span>Sub Total</span>
                            <span className="font-medium">{(paymentSummary.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#312B5B] md:text-base ">
                            <span>Processing Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.fees.processing_fee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#312B5B] md:text-base ">
                            <span>System Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.fees.system_fee).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-t border-dashed border-[#6F7282] pt-2 mx-3">
                        <span className="text-[#312B5B] text-lg font-bold">Amount Paid</span>
                        <span className="text-[#312B5B] font-bold text-xl">₱ {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                
                    <div className=" border-[#6F7282] border-t border-dashed pt-2 mb-3 mx-3"/>

                    <div className="space-y-2 sm p-3 px-3 md:text-base">
                        <div className="flex justify-between">
                        <span className="text-[#312B5B]">Reference No.</span>
                        <span className="text-[#312B5B] font-medium break-all ml-2">{paymentSummary.reference_id}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-[#312B5B]">Date & Time</span>
                        <span className="text-[#312B5B] font-medium ml-2">Created at {paymentSummary.created_at}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-[#312B5B]">Payment Method</span>
                        <span className="text-[#312B5B] font-medium ml-2">Payment Method Placeholder</span>
                        </div>
                    </div>  
                </div>


            {/* Security Footer */}
            <div className="bg-white border border-gray-100 rounded-bl-xl rounded-br-xl py-5 px-3 mb-4 shadow-lg w-full">
                <p className="text-[11px] text-[#6F7282]">
                Make sure the browser bar displays <span className="font-bold text-[#312B5B]">PulseTech</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:gap-10 w-full md:pt-10">
                <button
                    onClick={handleDownload} 
                    className="flex w-[60%] md:w-full mx-auto items-center justify-center gap-1 border border-[#312B5B] text-[#312B5B] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors sm text-xs">
                        <Printer size={14} />
                        Print Receipt
                </button>
                <button 
                        className="w-[60%] md:w-full mx-auto max-w-60 bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:from-[#312B5B] hover:to-[#0182B5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
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


