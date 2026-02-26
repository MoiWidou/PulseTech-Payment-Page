import React from 'react';
import { useLocation} from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import Stepper from '../components/stepper/Stepper';


type paymentResponse = {
    transaction_id: string;
    currency      : string;
    created_at    : string;
    status        : string;
    reference_id  : string;
    type          : string;
    error         : string | null;
    amount        : string;
    fees          : {
        system_fee      : string,
        processing_fee : string,
    }
    redirect_url  : string | null;
}

interface PaymentMethod {
    id: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

type PaymentDetails = {
    amount               : number;
    method               : string;
    methodLabel          : string;
    methodId             : string;
    selectedBank        ?: string;
    selectedCard        ?: string;
    selectedOnlineBank  ?: string;
    selectedOnlineOTC   ?: string;
    selectedOnlineWallet?: string;
    totalAmount          : number;
    merchantName         : string;
    methodCode           : string;
    providerCode         : string;
    processingFee        : number;
    paymentResponse      : paymentResponse;
    paymentmethods       : PaymentMethod[];
    systemFee            : number;
    success_url         ?: string;
    failed_url          ?: string;
};


const Confirm: React.FC = () => {
    const navigate = useNavigate();
    const { merchant_username } = useParams();
    const location = useLocation();
    const { paymentDetails } = location.state as { paymentDetails: PaymentDetails };

    const displayedTotalAmount = paymentDetails.amount 
        + Number(paymentDetails.paymentResponse?.fees?.processing_fee ?? 0)
        + Number(paymentDetails.paymentResponse?.fees?.system_fee ?? 0);

    if (!paymentDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 font-bold">Error: Payment details not found.</p>
            </div>
        );
    }

    return (
        /* UI Style Update: Background from Purple to Light Greenish/White */
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#E6F4F1] p-2 font-sans mb-7">
            
            {/* Header Section */}
            <header className="flex flex-col items-center mb-4 pt-10">
                <div className="w-20 h-20 bg-[#D9D9D9] rounded-full mb-2" />
                {/* UI Style Update: Text color from Purple to Dark Green */}
                <h2 className="text-[#064e3b] text-lg font-bold">{paymentDetails.merchantName}</h2>
            </header>

            {/* Main Card - Increased max-width and matched padding */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-6 md:p-12 md:px-25 flex flex-col items-center">
                    
                    {/* Stepper Integration */}
                    <div className="w-full mb-8">
                        <Stepper steps={["Amount", "Confirm"]} currentStep={2} />
                    </div>

                    {/* Gray Summary Box - Matched Success styling */}
                    <div className="w-full bg-[#F4F6F8] rounded-tr-2xl rounded-tl-2xl border border-gray-100 p-4 shadow-lg">
                        
                        <div className="space-y-2 mb-5 p-3">
                            {/* UI Style Update: Text color from Purple to Dark Green */}
                            <h3 className="text-center font-bold tracking-wider text-[#064e3b] mb-8">
                                Payment Summary
                            </h3>
                            
                            {/* UI Style Update: Text colors from Purple to Dark Green */}
                            <div className="flex justify-between text-[#064e3b] text-xs">
                                <span>Sub Total</span>
                                <span className="font-medium">{Number(paymentDetails.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-[#064e3b] text-xs">
                                <span>Processing Fee</span>
                                <span className="font-medium">₱{Number(paymentDetails.paymentResponse?.fees?.processing_fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-[#064e3b] text-xs">
                                <span>System Fee</span>
                                <span className="font-medium">₱{Number(paymentDetails.paymentResponse?.fees.system_fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Amount Section with Dashed Divider */}
                        {/* UI Style Update: Text and Border colors updated to Dark Green / Muted Slate */}
                        <div className="flex justify-between items-center p-3 border-t border-dashed border-[#A0AEC0] pt-2 mx-3">
                            <span className="text-[#064e3b] font-bold">You are sending</span>
                            <span className="text-[#064e3b] font-bold ">
                                ₱{displayedTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    
                        <div className="border-[#A0AEC0] border-t border-dashed pt-2 mb-3 mx-3"/>

                        {/* Method Detail Section */}
                        {/* UI Style Update: Text color to Dark Green */}
                        <div className="space-y-2 p-3 px-3 md:text-base">
                            <div className="flex justify-between">
                                <span className="text-[#064e3b] text-xs">Payment Method</span>
                                <span className="text-[#064e3b] font-medium ml-2 text-xs">{paymentDetails.methodLabel}</span>
                            </div>
                        </div>  
                    </div>

                    {/* Security Footer - Matched Success styling */}
                    <div className="bg-white border border-gray-100 rounded-bl-xl rounded-br-xl py-5 px-3 mb-4 shadow-lg w-full">
                        <p className="text-[11px] text-[#6F7282] text-center">
                            {/* UI Style Update: Highlight text color to Dark Green */}
                            Make sure the browser bar displays <span className="font-bold text-[#064e3b]">PulseTech</span>
                        </p>
                    </div>

                    {/* Action Buttons - Matched Success grid and sizing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:gap-10 w-full md:pt-10">
                        <button 
                            /* UI Style Update: Border and Text from Purple to Dark Green */
                            className="flex w-[60%] md:w-full mx-auto items-center justify-center gap-1 border border-[#064e3b] text-[#064e3b] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg hover:bg-emerald-50 transition-colors text-xs"
                            onClick={() => navigate(`/${merchant_username}`, { state: { previousDetails: paymentDetails } })}
                        >
                            Back
                        </button>
                        <button 
                            /* UI Style Update: Gradient from Navy/Blue to Dark Green/Emerald */
                            className="w-[60%] md:w-full mx-auto max-w-60 bg-[#202122] text-[#75EEA5] cursor-pointer hover:from-[#1B2A27] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
                            onClick={() => {
                                const url = paymentDetails.paymentResponse.redirect_url;
                                if (url) window.location.href = url;
                            }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirm;