import React, { useEffect, useState } from 'react';
import { 
//   Facebook, 
//   Instagram, 
//   Link2, 
  XCircle 
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";


type PaymentMethodItem = {
    provider_code: string;
    name: string;
    short_name: string;
    main_logo_url: string;
    status: string;
    country_code: string;
    fee_value: string | null;
    fee_type: string | null;
    method_code: string;
    category: string;
}

type PaymentMethodsResponse = Record<string, PaymentMethodItem[]>;

const FailedModal: React.FC = () => {
    const api_base_url = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();
    // const location = useLocation();
    // const { paymentSummary } = location.state || {};
    const [ _loading, setLoading ] = useState(false);
    const [ _error, setError ]     = useState<string | null>(null);
    const [searchParams]= useSearchParams();
    const reference_id  = searchParams.get("reference_id");
    const [ paymentSummary, setPaymentSummary] = useState <redirectResponse | null > (null);
    const [ merchantName, setMerchantName ]    = useState ("");
    
    const { merchant_username } = useParams();

        useEffect(() => {
                if (!merchant_username || !reference_id) return;
        
                const fetchData = async () => {
                    try {
                    setLoading(true);
                    setError(null);
        
                    const [paymentRes, merchantRes, methodRes] = await Promise.all([
                        fetch(
                        `${api_base_url}/payment-page/${merchant_username}/payment?transaction_id=${encodeURIComponent(reference_id)}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                        }
                        ),
                        fetch(`${api_base_url}/payment-page/${merchant_username}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        }),
                        fetch(
                            `${api_base_url}/payment-page/payment/methods?username=${merchant_username}`,
                            { 
                                method: "GET",
                                headers: { 
                                    "Content-Type": "application/json",
                                    "username"    : merchant_username
                                } 
                                
                        }
                        ),
                    ]);
        
                    if (!paymentRes.ok) throw new Error("Failed to verify payment");
                    if (!merchantRes.ok) throw new Error("Failed to fetch merchant");
        
                    const paymentData  = await paymentRes.json();
                    const merchantData = await merchantRes.json();
        
                    // Then set it in state
                    
                    setPaymentSummary(paymentData);
                    setMerchantName(merchantData.merchant_name);
        
                    } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Something went wrong");
                    }
                    } finally {
                    setLoading(false);
                    }
                };
        
                fetchData();
            }, [merchant_username, reference_id]);
    
    const totalAmount = (Number(paymentSummary?.amount)) + (Number(paymentSummary?.fees?.processing_fee)) + (Number(paymentSummary?.fees?.system_fee))

    const Spinner = () => (
        <span className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
    );

    //Loading state
    if (_loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#D0BBE6]">
                <Spinner />
            </div>
        );
    }

    // Error State
    if (_error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#D0BBE6] text-center px-4">
                <p className="text-red-600 font-semibold mb-2">Something went wrong</p>
                <p className="text-[#312B5B] text-sm">{_error}</p>
            </div>
        );
    }

    if (!paymentSummary) return <p className="text-center mt-10 text-[#312B5B]">No payment details available.</p>;

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
                <h2 className="text-[#312B5B] text-lg font-bold">{merchantName}</h2>
                <div className="flex gap-2 mt-1 text-[#312B5B]">
                    {/* <Facebook size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram size={16} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    <Link2 size={16} className="cursor-pointer hover:opacity-70 transition-opacity" /> */}
                </div>
            </div>

            {/* Main Failed Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
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
                            Your payment to <span className="text-[#007AFF] font-medium cursor-pointer">{merchantName}</span>
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
                            className="w-full max-w-60 bg-linear-to-r from-[#2B3565] to-[#0171A3] hover:from-[#312B5B] hover:to-[#0182B5] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md text-xs"
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

export default FailedModal;
