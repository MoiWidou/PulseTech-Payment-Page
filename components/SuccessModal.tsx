import React, { useRef } from 'react';
import { 
// Facebook, 
// Instagram, 
// Link2, 
Printer
} from 'lucide-react';

import { useLocation, useNavigate, useParams } from "react-router-dom";
import SharpSuccessBadge from './logos/sharpbadge';

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const SuccessModal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { merchant_username } = useParams();
    
    const { paymentSummary } = location.state || {};

    const receiptRef = useRef<HTMLDivElement>(null);

    if (!paymentSummary) return <p>No payment details available.</p>;



    // const { totalAmount, method, _subTotal, _processingFee, _systemFee } = paymentSummary;
    const { totalAmount, method, referenceNo, dateTime, merchantName} = paymentSummary;

    const paymentDetails = {
        amount: totalAmount,
        referenceNo: referenceNo,
        dateTime:dateTime,
        method: method
    };

    const handlePrintPDF = async () => {
        if (!receiptRef.current) return;

        const canvas = await html2canvas(receiptRef.current);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Receipt_${paymentDetails.referenceNo}.pdf`);
    };

    // console.log(paymentSummary.methodId)
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#D0BBE6] p-2 font-sans">
        
        {/* Header Section */}
        <header className="flex flex-col items-center mb-4 pt-10">
            <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
            <h2 className="text-[#312B5B] text-lg font-bold">{merchantName}</h2>
            <div className="flex gap-2 mt-1 text-[#312B5B]">
            {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
            <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
            </div>
        </header>

        {/* Main Success Card */}
        <div 
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

                    <div className="space-y-2 text-xs mb-10 p-3">

                        <h3 className="text-center text-base font-bold tracking-wider text-[#312B5B] mb-8">Payment Summary</h3>
                        
                        <div className="flex justify-between text-[#312B5B]">
                            <span>Sub Total</span>
                            <span className="font-medium">{paymentSummary.subTotal}</span>
                        </div>
                        <div className="flex justify-between text-[#312B5B]">
                            <span>Processing Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.processingFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#312B5B]">
                            <span>System Fee</span>
                            <span className="font-medium">₱{Number(paymentSummary.systemFee).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-t border-dashed border-[#6F7282] pt-2 mx-3">
                        <span className="text-[#312B5B] text-lg font-bold">Amount Paid</span>
                        <span className="text-[#312B5B] font-bold text-xl">₱ {Number(paymentDetails.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                
                    <div className=" border-[#6F7282] border-t border-dashed pt-2 mb-3 mx-3"/>

                    <div className="sm p-3 px-3 text-xs">
                        <div className="flex justify-between my-3">
                        <span className="text-[#312B5B]">Reference No.</span>
                        <span className="text-[#312B5B] font-medium break-all ml-2">{paymentDetails.referenceNo}</span>
                        </div>
                        <div className="flex justify-between my-8">
                        <span className="text-[#312B5B]">Date & Time</span>
                        <span className="text-[#312B5B] font-medium ml-2">{paymentDetails.dateTime}</span>
                        </div>
                        <div className="flex justify-between my-3">
                        <span className="text-[#312B5B]">Payment Method</span>
                        <span className="text-[#312B5B] font-medium ml-2">{paymentDetails.method}</span>
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
                    onClick={handlePrintPDF} 
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

        {/* Copy for receipt */}

        <div style={{ position: "absolute", left: "-9999px", top: 0 }} ref={receiptRef}>
            <div style={{
                background: "#FFFFFF",
                padding: "24px",
                borderRadius: "16px",
                color: "#312B5B",
                width: "100%",
                maxWidth: "600px"
            }}>
                {/* Success Badge */}
                <div className="flex justify-center mb-6">
                <SharpSuccessBadge className="w-12 h-12" />
                </div>

                <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", textAlign: "center" }}>
                Payment Successful
                </h1>
                <p style={{ fontSize: "14px", color: "#6F7282", marginBottom: "16px", textAlign: "center" }}>
                Thank you for your payment. Your payment has been processed successfully.
                </p>

                {/* Details Table */}
                <div style={{
                background: "#F4F6F8",
                borderRadius: "16px 16px 0 0",
                border: "1px solid #E5E7EB",
                padding: "16px"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: "bold" }}>
                    <span>Amount Paid</span>
                    <span>₱ {Number(paymentDetails.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div style={{ borderTop: "1px dashed #6F7282", margin: "8px 0" }} />

                <div style={{ fontSize: "12px", padding: "8px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Reference No.</span>
                    <span style={{ fontWeight: "500" }}>{paymentDetails.referenceNo}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Date & Time</span>
                    <span style={{ fontWeight: "500" }}>{paymentDetails.dateTime}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Payment Method</span>
                    <span style={{ fontWeight: "500" }}>{paymentDetails.method}</span>
                    </div>
                </div>
                </div>

                {/* Security Footer */}
                <div style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "0 0 16px 16px",
                padding: "16px",
                marginTop: "16px",
                textAlign: "center",
                fontSize: "11px",
                color: "#6F7282"
                }}>
                Make sure the browser bar displays <span style={{ fontWeight: "bold", color: "#312B5B" }}>PulseTech</span>
                </div>
            </div>
        </div>


        </div>
    );
};

export default SuccessModal;


